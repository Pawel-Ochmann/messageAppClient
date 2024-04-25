import { useEffect, useState, useContext } from 'react';
import { getAddress } from '../../utils/serverAddress';
import Conversation from '../../components/conversation/Conversation';
import { UserContext } from '../../Context';
import Dashboard from '../../components/dashboard/Dashboard';
import { User, ConversationType } from '../../types/index';
import updateConversation from '../../utils/updateConversations';
import { updateLastRead } from '../../utils/lastRead';
import styles from './styles/app.module.css';
import { Socket, io } from 'socket.io-client';
import AuthorizationProvider from '../../components/AuthorizationProvider';

export default function App() {
  const [socket] = useState<Socket>(
    io(getAddress(''), {
      reconnectionDelayMax: 10000,
      timeout: 5000,
      reconnectionAttempts: 3,
      autoConnect: false,
    })
  );
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [chatOpen, setChatOpen] = useState<ConversationType | null>(null);
  const [newGroup, setNewGroup] = useState(false);
 


  useEffect(() => {
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

    socket.on('updatedUserDocument', (updatedUser: User) => {
      const newMessageAudio = new Audio('/audio/newConversation.wav');
      const volume = localStorage.getItem('volume');
      if (volume) newMessageAudio.volume = parseInt(volume) / 100;
      newMessageAudio.play();
      setUser(updatedUser);
      newGroup && setNewGroup(false);
    });

    socket.on('connect', () => {
      user && socket.emit('join', user.name);
      setSocketConnected(true);
    });

    return () => {
      socket.off('message');
      socket.off('updateUserDocument');
      socket.off('connect');
    };
  }, [chatOpen, newGroup, setUser, socket, user]);

  useEffect(() => {
    const connectToSocket = async () => {
      try {
        if (socket && !socketConnected) {
          console.log('connecting to socket');
          socket.connect();
        }
      } catch (error) {
        console.error('Error connecting to socket:', error);
      }
    };

    if (user) connectToSocket();
  }, [user, socket, socketConnected]);

  useEffect(() => {
    if (chatOpen) {
      updateLastRead(chatOpen);
    }
  }, [chatOpen]);

  if (!user) return <></>;
  return (
    <AuthorizationProvider>
      <div className={styles.container}>
        {socket && (
          <Dashboard
            setChatOpen={setChatOpen}
            socket={socket}
            newGroup={newGroup}
            openNewGroup={setNewGroup}
          />
        )}
        {socket && (
          <Conversation
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
            socket={socket}
          />
        )}
      </div>
    </AuthorizationProvider>
  );
}