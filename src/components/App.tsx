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
  const [newGroup, setNewGroup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const connectToSocket = async () => {
      try {
        if (!socket || !socket.connected) {
          const newSocket = io('http://localhost:4000', {
            reconnectionDelayMax: 10000,
            timeout: 5000,
            reconnectionAttempts: 3,
          });

          newSocket.on('connect', () => {
            console.log('joining');
            user && newSocket.emit('join', user.name);
          });
          setSocket(newSocket);
          console.log('Socket connected!');
        }
      } catch (error) {
        console.error('Error connecting to socket:', error);
      }
    };

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
        socket.disconnect();
      };
    };

    if (!user) checkLoggedIn();
    else connectToSocket();

    if (socket && socket.connected) {
      socket.on('test', (e) => {
        console.log(e);
      });

      socket.on('updatedUserDocument', (updatedUser: User) => {
        const newMessageAudio = new Audio('/audio/newConversation.wav');
        newMessageAudio.play();
        setUser(updatedUser);
        newGroup && setNewGroup(false);
      });

      socket.on('message', (conversation: ConversationType) => {
        updateConversation(setUser, conversation, chatOpen, setChatOpen);
        if (
          conversation.messages[conversation.messages.length - 1].author !==
          user?.name
        ) {
          const newMessageAudio = new Audio('/audio/newMessage.wav');
          newMessageAudio.play();
        }
      });
    }
  }, [navigate, setUser, chatOpen, user, newGroup]);

  useEffect(() => {
    if (chatOpen) {
      updateLastRead(chatOpen);
    }
  }, [chatOpen]);

  if (!user) return <></>;
  return (
    <>
      <div>
        <Dashboard
          setChatOpen={setChatOpen}
          socket={socket}
          newGroup={newGroup}
          openNewGroup={setNewGroup}
        />
        {socket && <Conversation chatOpen={chatOpen} setChatOpen={setChatOpen} socket={socket} />}
      </div>
    </>
  );
}
