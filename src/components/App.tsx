import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/tokenHandler';
import { getAddress } from '../utils/serverAddress';
import Conversation from './Conversation';
import { io, Socket } from 'socket.io-client';

type Message = {
  author: string;
  content: string;
  date: Date;
};

export default function App() {
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const navigate = useNavigate();

useEffect(() => {
  const checkLoggedIn = async () => {
    try {
      const token = getToken();

      if (!token) {
        navigate('/login');
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await axios.get(getAddress('/'));
      setUser('Connecting to the server...');

      // Establish Socket.IO connection and set socket state
      const newSocket = io(getAddress('/'));
      setSocket(newSocket);

      // Emit 'join' event to server
      if (newSocket) {
        newSocket.emit('join');
      }

      // Event listener for 'messages' event from server
      if (newSocket) {
        newSocket.on('messages', (receivedMessages: Message[]) => {
          // Update state with received messages
          setMessages(receivedMessages);
        });
      }

      // Clean up Socket.IO event listener when component unmounts
      return () => {
        if (newSocket) {
          newSocket.off('messages');
          newSocket.disconnect(); // Disconnect the socket when component unmounts
        }
      };
    } catch (error) {
      console.error('Error during socket initialization:', error);
      navigate('/login');
    }
  };

  checkLoggedIn();
}, [navigate]);


  const goToSignup = () => {
    navigate('/sign');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  // Inside the App component
  const sendMessage = (message: Message) => {
     socket ? socket.emit('newMessage', message) : ''
  };

  return (
    <>
      <h1>You have been logged!</h1>
      <p>{user.toString()}</p>
      <Conversation messages={messages} sendMessage={sendMessage} />
      <button onClick={goToSignup}>Go to Signup</button>
      <button onClick={goToLogin}>Go to Login</button>
    </>
  );
}
