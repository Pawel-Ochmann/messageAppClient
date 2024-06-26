import { User, ConversationType } from '../types/index';
import { updateLastRead } from './lastRead';

export type UpdateConversationHandler = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  updatedConversation: ConversationType,
  chatOpen: ConversationType | null,
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>
) => void;

const updateConversation: UpdateConversationHandler = (
  setUser: React.Dispatch<React.SetStateAction<User>>,
  updatedConversation: ConversationType,
  chatOpen: ConversationType | null,
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>
) => {
  setUser((prevUser) => {
    const updatedConversations = prevUser.conversations.map((conversation) => {
      if (conversation.key === updatedConversation.key) {
        return updatedConversation;
      }
      return conversation;
    });
    return {
      ...prevUser,
      conversations: updatedConversations,
    };
  });
  if (chatOpen && chatOpen.key === updatedConversation.key) {
    updateLastRead(updatedConversation);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setChatOpen((_e) => {
      return updatedConversation;
    });
  }
};

export default updateConversation;
