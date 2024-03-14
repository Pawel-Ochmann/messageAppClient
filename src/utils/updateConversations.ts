import { MessageBackend, Conversation } from '../types/index';

export type UpdateConversationHandler = (
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  message: MessageBackend,
  conversationId: string
) => void;

const updateConversation:UpdateConversationHandler = (
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  message: MessageBackend,
  conversationId: string
) => {
  setConversations((prevConversations) => {
    return prevConversations.map((conversation) => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          messages: [...conversation.messages, message],
        };
      }
      return conversation;
    });
  });
};

export default updateConversation;
