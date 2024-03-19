import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context';
import getConversationName from '../utils/getConversationName';
import { ConversationType } from '../types';
import { hasBeenRead } from '../utils/lastRead';

const Contacts = ({
  setChatOpen,
}: {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
}) => {
  const { user } = useContext(UserContext);
  const [userConversations, setUserConversations] = useState(
    user?.conversations || []
  );

  useEffect(() => {
    setUserConversations(user?.conversations || []);
  }, [user]);

  const groups = userConversations.filter((conversation) => conversation.group);
  const single = userConversations.filter(
    (conversation) => !conversation.group
  );

  return (
    <div>
      <div>
        <h2>Groups</h2>
        <ul>
          {user && groups.map((conversation) => (
            <li key={conversation.key}>
              <button
                onClick={() => setChatOpen(conversation)}
                style={{
                  color: hasBeenRead(conversation) ? 'white' : 'green',
                }}
              >
                {getConversationName(user, conversation)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Singles</h2>
        <ul>
          {user && single.map((conversation) => (
            <li key={conversation.key}>
              <button
                onClick={() => setChatOpen(conversation)}
                style={{
                  color: hasBeenRead(conversation) ? 'white' : 'green',
                }}
              >
                {getConversationName(user, conversation)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Contacts;
