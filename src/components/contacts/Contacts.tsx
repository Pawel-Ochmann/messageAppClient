import React, { useContext, useCallback } from 'react';
import { UserContext } from '../../Context';
import { ConversationType } from '../../types';
import ContactBox from '../contactBox/ContactBox';
import styles from './styles/contacts.module.css';
import { sortContacts } from '../../utils/sortContacts';
import classNames from 'classnames';

interface Props {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
}

const Contacts = ({ setChatOpen }: Props) => {
  const { user, darkTheme } = useContext(UserContext);
  const sortedContacts = useCallback(() => {
    return sortContacts(user.conversations);
  }, [user]);

const classes = {
  container: classNames(styles.container, { [styles.dark]: darkTheme }),
  contactList: styles.contactList,
};

  return (
    <div className={classes.container}>
      <ul className={classes.contactList}>
        {
          sortedContacts().map((conversation) => (
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
