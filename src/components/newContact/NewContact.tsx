import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { getToken } from '../utils/tokenHandler';
import { getAddress } from '../utils/serverAddress';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context';
import { User } from '../types/index';
import { v4 as uuid } from 'uuid';
import { ConversationType } from '../types/index';
import styles from './styles/newContact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import UserImage from './UserImage';

interface Contact {
  _id: string;
  name: string;
}

const NewContact = ({
  className,
  setChatOpen,
  openHandler,
}: {
  className: string;
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  openHandler: Dispatch<SetStateAction<boolean>>;
}) => {
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
      const token = getToken();

      if (!token) {
        navigate('/login');
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const response = await axios.get(getAddress(`/contacts/${user.name}`));
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, [navigate, user.name]);

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

  return (
    <div
      className={`${className} ${styles.container} ${darkTheme && styles.dark}`}
    >
      <header className={`${styles.header} ${darkTheme && styles.dark}`}>
        <button
          className={styles.buttonBack}
          onClick={() => openHandler(false)}
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>
        <div className={styles.info}>
          <h2>Select contact</h2>
          <p>{filteredContacts.length}</p>
        </div>
      </header>
      <input
        className={`${styles.searchInput} ${darkTheme && styles.dark}`}
        type='text'
        placeholder='Find contacts'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className={styles.contactsContainer}>
        {filteredContacts.map((contact) => (
          <button
            key={contact._id}
            className={`${styles.contactBox} ${darkTheme && styles.dark}`}
            onClick={() => {
              createNewConversation(contact._id, contact.name);
            }}
          >
            <UserImage userName={contact.name} />
            <h2 className={styles.contactName}>{contact.name}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewContact;
