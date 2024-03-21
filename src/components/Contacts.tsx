import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context';
import { ConversationType } from '../types';
import ContactBox from './ContactBox';

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

 

    const getLastMessageDate = (
      conversation: ConversationType
    ): Date | null => {
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      return lastMessage ? new Date(lastMessage.date) : null;
    };

    // Sort conversations based on the date of the last message
    const sortedContacts = [...userConversations].sort((a, b) => {
      const dateA = getLastMessageDate(a);
      const dateB = getLastMessageDate(b);
      return dateB && dateA ? dateB.getTime() - dateA.getTime() : 0;
    });



  return (
    <div>
      <div>
        <h2>Groups</h2>
        <ul>
          {user && sortedContacts.map((conversation) => (
            <li key={conversation.key}>
              <ContactBox conversation={conversation} setChatOpen={setChatOpen} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Contacts;
