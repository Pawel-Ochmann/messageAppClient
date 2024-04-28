import { useEffect, useState, useContext } from 'react';
import getConversationName from '../utils/getConversationName';
import { UserContext } from '../Context';
import { Socket } from 'socket.io-client';
import { ConversationType } from '../types';

interface Props{socket:Socket, chatOpen:ConversationType | null}

export const useTypingInfo = ({socket,chatOpen}:Props) => {
  const { user } = useContext(UserContext);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserIsTyping, setOtherUserIsTyping] = useState('');

  const sendTyping = () => {
    if (isTyping) return;
    if (chatOpen && user) {
      socket.emit('typing', getConversationName(user, chatOpen), user.name);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const handleTyping = (userName: string) => {
      if (chatOpen && user) {
        const anotherUser = getConversationName(user, chatOpen);
        if (anotherUser === userName) {
          setOtherUserIsTyping(`${anotherUser} is typing...`);
          setTimeout(() => {
            setOtherUserIsTyping('');
          }, 2000);
        }
      }
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
    };
  }, [chatOpen, socket, user]);

  return {
    sendTyping,
    otherUserIsTyping,
  };
};

