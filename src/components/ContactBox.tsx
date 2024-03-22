import { ConversationType } from '../types';
import { hasBeenRead, numberOfUnreadMessages } from '../utils/lastRead';
import getConversationName from '../utils/getConversationName';
import { useContext, useState } from 'react';
import { UserContext } from '../Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { getAddress } from '../utils/serverAddress';

const ContactBox = ({
  conversation,
  setChatOpen,
}: {
  conversation: ConversationType;
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
}) => {
  const { user } = useContext(UserContext);
  const [imageLoaded, setImageLoaded] = useState(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getContactImage = (conversation: ConversationType) => {
    if (conversation.group) {
      return getAddress(`/group/${conversation.key}`);
    } else if (user) {
      const userName = getConversationName(user, conversation);
      return getAddress(`/${userName}/avatar`);
    }
  };

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
    return lastMessage ? lastMessage.date.toString() : ''
  }


  return (
    <button
      onClick={() => setChatOpen(conversation)}
      style={{
        color: hasBeenRead(conversation) ? 'white' : 'green',
      }}
    >
      <div>
        {imageLoaded ? (
          <img
            src={getContactImage(conversation)}
            alt=''
            style={{ width: '100px' }}
            onLoad={handleImageLoad}
            onError={() => setImageLoaded(false)}
          />
        ) : conversation.group ? (
          <FontAwesomeIcon icon={faUserGroup} />
        ) : (
          <FontAwesomeIcon icon={faUser} />
        )}
        <h3>{user && getConversationName(user, conversation)}</h3>
        <p>{getLastMessageContent(conversation)}</p>
        <p>{getLastMessageDate(conversation)}</p>
        <p>{numberOfUnreadMessages(conversation)}</p>
      </div>
    </button>
  );
};

export default ContactBox;
