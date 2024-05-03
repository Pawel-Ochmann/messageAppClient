import { useState, useEffect, useContext } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context';
import { v4 as uuid } from 'uuid';
import { ConversationType, User } from '../../types/index';
import styles from './newContact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import UserImage from '../userImage/UserImage';
import { fetchContactsApi } from '../../api/fetchContactsApi';
import classNames from 'classnames';

interface Contact {
  _id: string;
  name: string;
}

interface Props {
  className: string;
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  openHandler: Dispatch<SetStateAction<boolean>>;
}

const NewContact = ({
  className,
  setChatOpen,
  openHandler,
}:Props) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const { user, darkTheme } = useContext(UserContext) as {
    user: User;
    darkTheme: boolean;
  };

useEffect(() => {
  const fetchContacts = async () => {
    try {
      const contactsData = await fetchContactsApi(user);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      navigate('/login')
      return
    }
  };

  fetchContacts();
}, [navigate, user]);

  useEffect(() => {
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [contacts, searchQuery]);

  const createNewConversation = (_id: string, name: string) => {
    const newConversation: ConversationType = {
      key: uuid(),
      messages: [],
      participants: [user._id, _id],
      name: [user.name, name],
      group: false,
      new: true,
    };

    const isAlreadyCreated = user.conversations.find((e) => {
      return e.name.includes(name);
    });
    if (isAlreadyCreated) {
      setChatOpen(isAlreadyCreated);
      return;
    }

    setChatOpen(newConversation);
  };

const classes = {
  container: classNames(className, styles.container, {
    [styles.dark]: darkTheme,
  }),
  header: classNames(styles.header, { [styles.dark]: darkTheme }),
  buttonBack: styles.buttonBack,
  info: styles.info,
  searchInput: classNames(styles.searchInput, { [styles.dark]: darkTheme }),
  contactsContainer: styles.contactsContainer,
  contactBox: classNames(styles.contactBox, { [styles.dark]: darkTheme }),
  contactName: styles.contactName,
};


  return (
    <div
      className={classes.container}
    >
      <header className={classes.header}>
        <button
          className={classes.buttonBack}
          onClick={() => openHandler(false)}
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>
        <div className={classes.info}>
          <h2>Select contact</h2>
          <p>{filteredContacts.length}</p>
        </div>
      </header>
      <input
        className={classes.searchInput}
        type='text'
        placeholder='Find contacts'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className={classes.contactsContainer}>
        {filteredContacts.map((contact) => (
          <button
            key={contact._id}
            className={classes.contactBox}
            onClick={() => {
              createNewConversation(contact._id, contact.name);
            }}
          >
            <UserImage userName={contact.name} />
            <h2 className={classes.contactName}>{contact.name}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewContact;
