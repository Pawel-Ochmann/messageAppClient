import { useState, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { getAddress } from '../utils/serverAddress';
import { UserContext } from '../Context';
import { ConversationType, User } from '../types';
import updateConversation from '../utils/updateConversations';
import { playAudio } from '../utils/playAudio';

interface Props {
  chatOpen: ConversationType | null;
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  newGroup: boolean;
  setNewGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSocket = ({
  chatOpen,
  setChatOpen,
  newGroup,
  setNewGroup,
}: Props) => {
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

  const handleIncomingMessage = (conversation: ConversationType) => {
    updateConversation(setUser, conversation, chatOpen, setChatOpen);
    if (
      conversation.messages[conversation.messages.length - 1].author !==
      user.name
    ) {
      playAudio('newMessage');
    }
  };

  const handleUpdatedUserDocument = (updatedUser: User) => {
    playAudio('newConversation');
    setUser(updatedUser);
    newGroup && setNewGroup(false);
  };

  const handleSocketConnect = () => {
    socket.emit('join', user.name);
    setSocketConnected(true);
  };

  return {
    socket,
    connectToSocket,
    handleIncomingMessage,
    handleUpdatedUserDocument,
    handleSocketConnect,
  };
};
