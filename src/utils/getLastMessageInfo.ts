import { ConversationType } from "../types";
import moment from "moment";

  export const getLastMessageContent = (conversation: ConversationType) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return '';
    else {
      switch (lastMessage.type) {
        case 'text': {
          const maxLength = 10;
          if (lastMessage.content.length > maxLength) {
            return lastMessage.content.substring(0, maxLength) + '...';
          } else {
            return lastMessage.content;
          }
        }

        case 'gif':
          return 'GIF';
        case 'image':
          return 'Image';
        case 'audio':
          return 'Audio';
        default:
          return '';
      }
    }
  };

  export const getLastMessageDate = (conversation: ConversationType) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage ? moment(lastMessage.date).fromNow() : '';
  };