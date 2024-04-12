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
import styles from './styles/app.module.css';

export default function App() {
  const [socket, setSocket] = useState<Socket>(io);
  const { user, setUser } = useContext(UserContext);
  const [chatOpen, setChatOpen] = useState<ConversationType | null>(null);
  const [newGroup, setNewGroup] = useState(false);
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
        const response = await axios.get(getAddress('/'), {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
        setUser(response.data);
      } catch (error) {
        navigate('/login');
        return;
      }
    };

    if (!user) checkLoggedIn();
  }, [navigate, setUser, user]);

  useEffect(() => {
    const connectToSocket = async () => {
      try {
        if (!socket) {
          const newSocket = io('http://localhost:4000', {
            reconnectionDelayMax: 10000,
            timeout: 5000,
            reconnectionAttempts: 3,
            autoConnect: false,
            reconnection: false,
          });

       
          setSocket(newSocket);
        }
      } catch (error) {
        console.error('Error connecting to socket:', error);
      }
    };

    if (user && !socket) connectToSocket();

    return () => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
      
    };
  }, [navigate, setUser, chatOpen, user, newGroup, socket]);

  useEffect(() => {
    if (socket && !socket.connected) {
      socket.connect();
       socket.on('connect', () => {
    user && socket.emit('join', user.name);
  })
    }
  }, [socket, user]);



  useEffect(() => {
    if (socket.connected) {
      socket.on('updatedUserDocument', (updatedUser: User) => {
        const newMessageAudio = new Audio('/audio/newConversation.wav');
        const volume = localStorage.getItem('volume');
        if (volume) newMessageAudio.volume = parseInt(volume) / 100;
        newMessageAudio.play();
        setUser(updatedUser);
        newGroup && setNewGroup(false);
      });
    }
    return () => {
      socket.off('updatedUserDocument');
    };
  }, [newGroup, setUser, socket]);

  useEffect(() => {
    if (socket.connected) {
      socket.on('message', (conversation: ConversationType) => {
        updateConversation(setUser, conversation, chatOpen, setChatOpen);
        if (
          conversation.messages[conversation.messages.length - 1].author !==
          user?.name
        ) {
          const newMessageAudio = new Audio('/audio/newMessage.wav');
          const volume = localStorage.getItem('volume');
          if (volume) newMessageAudio.volume = parseInt(volume) / 100;
          newMessageAudio.play();
        }
      });
    }
    return () => {
      socket.off('message');
    };
  }, [newGroup, setUser, socket, chatOpen, user?.name]);

  useEffect(() => {
    if (chatOpen) {
      updateLastRead(chatOpen);
    }
  }, [chatOpen]);

  if (!user) return <></>;
  return (
    <div className={styles.container}>
      <Dashboard
        setChatOpen={setChatOpen}
        socket={socket}
        newGroup={newGroup}
        openNewGroup={setNewGroup}
      />
      {socket && (
        <Conversation
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          socket={socket}
        />
      )}
    </div>
  );
}
