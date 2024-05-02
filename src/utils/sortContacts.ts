import { ConversationType } from '../types';

const getLastMessageDate = (conversation: ConversationType): Date | null => {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  return lastMessage ? new Date(lastMessage.date) : null;
};

export const sortContacts = (conversations: ConversationType[]):ConversationType[] => {
  return conversations.sort((a, b) => {
    const dateA = getLastMessageDate(a);
    const dateB = getLastMessageDate(b);
    if (!dateA && !dateB) {
      return 0;
    } else if (!dateA) {
      return 1;
    } else if (!dateB) {
      return -1;
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
};
