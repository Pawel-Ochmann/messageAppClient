import { useEffect, useState, useContext } from 'react';
import Conversation from '../../components/conversation/Conversation';
import { UserContext } from '../../Context';
import Dashboard from '../../components/dashboard/Dashboard';
import { ConversationType } from '../../types/index';
import { updateLastRead } from '../../utils/lastRead';
import styles from './app.module.css';
import AuthorizationProvider from '../../components/AuthorizationProvider';
import { useSocket } from '../../hooks/useSocket';

export default function App() {
  const { user } = useContext(UserContext);
  const [chatOpen, setChatOpen] = useState<ConversationType | null>(null);
  const [newGroup, setNewGroup] = useState(false);
  const {
    socket,
    connectToSocket,
    handleIncomingMessage,
    handleUpdatedUserDocument,
    handleSocketConnect,
  } = useSocket({ chatOpen, setChatOpen, newGroup, setNewGroup });

  useEffect(() => {
    if (user.name !== '') connectToSocket();
  }, [connectToSocket, user]);

  useEffect(() => {
    socket.on('message', handleIncomingMessage);
    socket.on('updatedUserDocument', handleUpdatedUserDocument);
    socket.on('connect', handleSocketConnect);

    return () => {
      socket.off('message', handleIncomingMessage);
      socket.off('updateUserDocument', handleUpdatedUserDocument);
      socket.off('connect', handleSocketConnect);
    };
  }, [
    handleIncomingMessage,
    handleSocketConnect,
    handleUpdatedUserDocument,
    socket,
  ]);

  useEffect(() => {
    if (chatOpen) {
      console.log('updating...')
      updateLastRead(chatOpen);
    }
  }, [chatOpen]);

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
