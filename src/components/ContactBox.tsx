import { ConversationType } from '../types';
import { hasBeenRead, numberOfUnreadMessages } from '../utils/lastRead';
import getConversationName from '../utils/getConversationName';
import { useContext } from 'react';
import { UserContext } from '../Context';
import UserImage from './UserImage';
import GroupImage from './GroupImage';
import styles from './styles/contactBox.module.css'
import moment from 'moment';

const ContactBox = ({
  conversation,
  setChatOpen,
}: {
  conversation: ConversationType;
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
}) => {
  const { user } = useContext(UserContext);

  const getLastMessageContent = (conversation: ConversationType) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return '';
    else {
      switch (lastMessage.type) {
        case 'text': {
          const maxLength = 20;
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

  const getLastMessageDate = (conversation:ConversationType)=> {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage ? moment(lastMessage.date).fromNow() : ''
  }


  return (
    <button
      onClick={() => setChatOpen(conversation)}
      style={{
        color: hasBeenRead(conversation) ? 'white' : 'green',
      }}
    >
      <div className={styles.contactBox}>
        <div className={styles.image}>
          {conversation.group ? (
            <GroupImage conversation={conversation} />
          ) : (
            user && (
              <UserImage userName={getConversationName(user, conversation)} />
            )
          )}
        </div>
        <h3>{user && getConversationName(user, conversation)}</h3>
        <p className={styles.date}>{getLastMessageDate(conversation)}</p>
        <p>{getLastMessageContent(conversation)}</p>
         <p>{numberOfUnreadMessages(conversation)}</p>
      </div>
    </button>
  );
};

export default ContactBox;
