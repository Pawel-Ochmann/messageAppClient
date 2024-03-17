import { User, ConversationType } from '../types/index';

export type UpdateConversationHandler = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  updatedConversation: ConversationType
) => void;

const updateConversation: UpdateConversationHandler = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  updatedConversation: ConversationType
) => {
  setUser((prevUser) => {
    if (!prevUser) return prevUser;
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
};

export default updateConversation;
