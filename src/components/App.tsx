import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { getToken } from '../utils/tokenHandler';
import { getAddress } from '../utils/serverAddress';
import Conversation from './Conversation';
import { UserContext } from '../Context';
import Dashboard from './Dashboard';
import { io, Socket } from 'socket.io-client';
import { MessageBackend } from '../types/index';

export default function App() {
  const [messages, setMessages] = useState<MessageBackend[]>([]);
  const [socket, setSocket] = useState<Socket>(io);
  const { user, setUser } = useContext(UserContext);
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
        await setUser(response.data);
        await connectToSocket();
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
          socket.off('messages');
          socket.disconnect();
        
      };
    };

    checkLoggedIn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, setUser]);

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

  if (!user) return <></>;
  return (
    <>
      <div style={{display:'flex'}}>
        <Dashboard />
        {socket && <Conversation messages={messages} socket={socket} />}
      </div>
    </>
  );
}
