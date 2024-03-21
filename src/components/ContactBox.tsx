import { ConversationType } from '../types';
import { hasBeenRead } from '../utils/lastRead';
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
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

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
            src={getAddress(`/group/${conversation.key}`)}
            alt=''
            style={{ width: '100px' }}
            onLoad={handleImageLoad}
            onError={() => setImageLoaded(false)}
          />
        ) : conversation.group ? (
          <FontAwesomeIcon icon={faUser} />
        ) : (
          <FontAwesomeIcon icon={faUserGroup} />
        )}
        <h3>{user && getConversationName(user, conversation)}</h3>
      </div>
    </button>
  );
};

export default ContactBox;
