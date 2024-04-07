import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context';
import { ConversationType } from '../types';
import ContactBox from './ContactBox';
import styles from './styles/contacts.module.css'

const Contacts = ({
  setChatOpen,
}: {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
}) => {
  const { user, darkTheme } = useContext(UserContext);
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
      <div className={`${darkTheme && styles.dark}`}>
        <ul className={styles.contactList}>
          {user && sortedContacts.map((conversation) => (
            <li key={conversation.key}>
              <ContactBox conversation={conversation} setChatOpen={setChatOpen} />
            </li>
          ))}
        </ul>
      </div>
   
  );
};
export default Contacts;
