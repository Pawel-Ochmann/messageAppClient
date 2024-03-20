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
        const newSocket = io('http://localhost:4000', {
          reconnectionDelayMax: 10000,
          timeout: 5000,
          reconnectionAttempts: 3,
        });
        user && newSocket.emit('join', user.name);

        newSocket.on('test', (e) => {
          console.log(e);
        });

        newSocket.on('updatedUserDocument', (updatedUser: User) => {
          const newConversationAudio = new Audio('/audio/newConversation.wav');
          newConversationAudio.play();
          setUser(updatedUser);
          newGroup && setNewGroup(false);
        });

        newSocket.on('message', (conversation: ConversationType) => {
          if (
            conversation.messages[conversation.messages.length - 1].author !==
            user?.name
          ) {
            const newMessageAudio = new Audio('/audio/newMessage.wav');
            newMessageAudio.play();
          }

          updateConversation(setUser, conversation, chatOpen, setChatOpen);
        });

        setSocket(newSocket);
        console.log('Socket connected!');
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

    checkLoggedIn();
  }, [navigate, setUser, chatOpen]);

  useEffect(() => {
    if (chatOpen) {
      updateLastRead(chatOpen);
    }
  }, [chatOpen]);

  if (!user) return <></>;
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Dashboard
          setChatOpen={setChatOpen}
          socket={socket}
          newGroup={newGroup}
          openNewGroup={setNewGroup}
        />
        {socket && <Conversation chatOpen={chatOpen} socket={socket} />}
      </div>
    </>
  );
}
