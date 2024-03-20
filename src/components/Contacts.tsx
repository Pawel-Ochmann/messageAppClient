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

    const getLastMessageDate = (
      conversation: ConversationType
    ): Date | null => {
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      return lastMessage ? new Date(lastMessage.date) : null;
    };

    // Sort conversations based on the date of the last message
    const sortedGroups = [...groups].sort((a, b) => {
      const dateA = getLastMessageDate(a);
      const dateB = getLastMessageDate(b);
      return dateB && dateA ? dateB.getTime() - dateA.getTime() : 0;
    });

    const sortedSingle = [...single].sort((a, b) => {
      const dateA = getLastMessageDate(a);
      const dateB = getLastMessageDate(b);
      return dateB && dateA ? dateB.getTime() - dateA.getTime() : 0;
    });

  return (
    <div>
      <div>
        <h2>Groups</h2>
        <ul>
          {user && sortedGroups.map((conversation) => (
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
          {user && sortedSingle.map((conversation) => (
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
