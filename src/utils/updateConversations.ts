import { MessageBackend, User } from '../types/index';

export type UpdateConversationHandler = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  message: MessageBackend,
  conversationId: string
) => void;

const updateConversation: UpdateConversationHandler = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  message: MessageBackend,
  conversationId: string
) => {
  setUser((prevUser) => {
    if (!prevUser) return prevUser; 
    const updatedConversations = prevUser.conversations.map((conversation) => {
      if (conversation._id === conversationId) {
        return {
          ...conversation,
          messages: [...conversation.messages, message],
        };
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
