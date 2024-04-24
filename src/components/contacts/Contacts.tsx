import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context';
import { ConversationType } from '../types';
import ContactBox from './ContactBox';
import styles from './styles/contacts.module.css';

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

  const getLastMessageDate = (conversation: ConversationType): Date | null => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage ? new Date(lastMessage.date) : null;
  };

  const sortedContacts = [...userConversations].sort((a, b) => {
    const dateA = getLastMessageDate(a);
    const dateB = getLastMessageDate(b);
    if (!dateA && !dateB) {
      return 0;
    } else if (!dateA) {
      return 1;
    } else if (!dateB) {
      return -1;
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });

  return (
    <div className={`${styles.container} ${darkTheme && styles.dark}`}>
      <ul className={styles.contactList}>
        {user &&
          sortedContacts.map((conversation) => (
            <li key={conversation.key}>
              <ContactBox
                conversation={conversation}
                setChatOpen={setChatOpen}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};
export default Contacts;
