import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { getToken } from '../utils/tokenHandler';
import { getAddress } from '../utils/serverAddress';
import Conversation from './Conversation';
import UserImage from './UserImage';
import { io, Socket } from 'socket.io-client';
import { Message, MessageBackend, MessageParam } from '../types/index';

export default function App() {
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState<MessageBackend[]>([]);
  const [socket, setSocket] = useState<Socket | null>();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = getToken();

      if (!token) {
        navigate('/login');
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await axios.get(getAddress('/'));
        console.log(response.data);
        const username = response.data;
        setUser(username);
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.status === 401
        ) {
          navigate('/login');
          return;
        }
        console.error('Error:', error);
      }
      return () => {
        if (socket) {
          socket.off('messages');
          socket.disconnect();
        }
      };
    };

    checkLoggedIn();
  }, [navigate, socket]);

  const connectToSocket = async () => {
    try {
      const newSocket = io('http://localhost:4000');
      setSocket(newSocket);
      console.log(newSocket);

      if (newSocket) {
        await newSocket.emit('join');
        console.log(newSocket);
      }

      if (newSocket) {
        newSocket.on('messages', (receivedMessages: MessageBackend[]) => {
          setMessages(receivedMessages);
        });
      }

      console.log('Socket connected!');
    } catch (error) {
      console.error('Error connecting to socket:', error);
    }
  };

  const goToSignup = () => {
    navigate('/sign');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const sendMessage = (message: MessageParam) => {
    const messageToSend: Message = {
      author: user.toString(),
      content: message.content,
      type: message.type,
      date: new Date(),
    };

    console.log(message)

    if (message.type === 'image' || message.type === 'audio') {
      const formData = new FormData();
      formData.append('file', message.content);
    }
    socket ? socket.emit('newMessage', messageToSend) : '';
  };

  const handleDisconnect = () => {
    if (socket) {
      console.log('disconnecting');
      socket.disconnect(); // Disconnect from the socket
      setSocket(null); // Clear the socket state
    }
  };

  return (
    <>
      <h1>You have been logged!</h1>
      <UserImage userName={user.toString()} />
      <p>{user.toString()}</p>
      <Conversation messages={messages} sendMessage={sendMessage} />
      <button onClick={connectToSocket}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect</button>
      <button onClick={goToSignup}>Go to Signup</button>
      <button onClick={goToLogin}>Go to Login</button>
    </>
  );
}
