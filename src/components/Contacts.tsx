import { useContext} from 'react';
import { UserContext } from '../Context';
import getConversationName from '../utils/getConversationName';

const Contacts = () => {

const {user} = useContext(UserContext)


  return (
    <div>
      <ul>
        {user && user.conversations.map((conversation) => (
            <li key={conversation.key}>
             <p>{getConversationName(user, conversation)}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Contacts;
