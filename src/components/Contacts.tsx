import { useContext} from 'react';
import { UserContext } from '../Context';
import getConversationName from '../utils/getConversationName';
import { ConversationType } from '../types';

const Contacts = ({
  setChatOpen,
}: {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
}) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <ul>
        {user &&
          user.conversations.map((conversation) => (
            <li key={conversation.key}>
              <button onClick={()=>{setChatOpen(conversation)}}>{getConversationName(user, conversation)}</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Contacts;
