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


  return (
    <div>
      <ul>
        {user &&
          userConversations.map((conversation) => (
            <li key={conversation.key}>
              <button
                onClick={() => setChatOpen(conversation)}
                style={{
                  color: hasBeenRead(conversation)
                    ? 'white'
                    : 'green',
                }}
              >
                {getConversationName(user, conversation)}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Contacts;
