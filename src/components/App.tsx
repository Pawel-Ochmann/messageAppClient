import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/tokenHandler';
import { getAddress } from '../utils/serverAddress';
import Conversation from './Conversation';
import { UserContext } from '../Context';
import Dashboard from './Dashboard';
import { io, Socket } from 'socket.io-client';
import { User, ConversationType } from '../types/index';
import updateConversation from '../utils/updateConversations';
import { updateLastRead } from '../utils/lastRead';


export default function App() {
  const [socket, setSocket] = useState<Socket>(io);
  const { user, setUser } = useContext(UserContext);
  const [chatOpen, setChatOpen] = useState<ConversationType | null>(null);
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
        setUser(response.data);
        await connectToSocket();
      } catch (error) {
        navigate('/login');
        return;
      }

      return () => {
        socket.off('messages');
        socket.disconnect();
      };
    };

    checkLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, setUser]);

    useEffect(() => {
      if (chatOpen) {
        updateLastRead(chatOpen);
      }
    }, [chatOpen]);

  const connectToSocket = async () => {
    try {
      const newSocket = io('http://localhost:4000');
      user && newSocket.emit('join', user.name);

      newSocket.on('updatedUserDocument', (updatedUser: User) => {
        console.log('trying to update user: ', updatedUser);
        setUser(updatedUser);
      });

      newSocket.on('message', (conversation: ConversationType) => {
        console.log('Received conversation from server: ', conversation);

        updateConversation(setUser, conversation, chatOpen, setChatOpen);
      });

      setSocket(newSocket);
      console.log('Socket connected!');
    } catch (error) {
      console.error('Error connecting to socket:', error);
    }
  };

  if (!user) return <></>;
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Dashboard setChatOpen={setChatOpen} />
        {socket && <Conversation chatOpen={chatOpen} socket={socket} />}
      </div>
    </>
  );
}
