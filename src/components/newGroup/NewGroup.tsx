import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { getToken } from '../utils/tokenHandler';
import { getAddress } from '../utils/serverAddress';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context';
import { User } from '../types/index';
import UserImage from './UserImage';
import { v4 as uuid } from 'uuid';
import { ConversationType } from '../types/index';
import { Socket } from 'socket.io-client';
import styles from './styles/newGroup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCircleCheck,
  faPeopleGroup,
  faCamera,
  faCircleXmark,
  faUsersViewfinder,
  faReply,
} from '@fortawesome/free-solid-svg-icons';

interface Contact {
  _id: string;
  name: string;
}

const NewGroup = ({
  setChatOpen,
  openHandler,
  socket,
  className,
}: {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  openHandler: Dispatch<SetStateAction<boolean>>;
  socket: Socket;
  className: string;
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const { user, darkTheme } = useContext(UserContext) as {
    user: User;
    darkTheme: boolean;
  };
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState<Contact[]>([]);
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [goFurther, setGoFurther] = useState(false);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setGroupImage(file);
      } else {
        alert('Please select a valid image file.');
      }
    } else {
      setGroupImage(null);
    }
  };

  const handleSubmit = async () => {
    const newConversation: ConversationType = {
      key: uuid(),
      messages: [],
      participants: [
        user._id,
        ...participants.map((e) => {
          return e._id;
        }),
      ],
      group: true,
      name: [groupName],
    };
    await socket.emit(
      'createNewConversation',
      newConversation,
      async (confirmation: boolean) => {
        if (confirmation && groupImage) {
          const reader = new FileReader();
          reader.onload = () => {
            socket.emit(
              'setGroupImage',
              newConversation.key,
              groupImage,
              (confirmation: boolean) => {
                if (!confirmation) {
                  console.error('Error: Group image could not be set');
                }
              }
            );
          };

          reader.readAsDataURL(groupImage);
        } else if (confirmation) {
          console.log('Group created');
        } else {
          console.error('Error: New chat creation confirmation failed');
        }
      }
    );
    setChatOpen(newConversation);
    openHandler(false);
  };

  const handleCheckboxChange = (contact: Contact) => {
    console.log(contact, participants);
    if (participants.some((c) => c._id === contact._id)) {
      setParticipants([...participants.filter((c) => c.name !== contact.name)]);
    } else {
      setParticipants([...participants, contact]);
    }
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
          <h2>Create new Group</h2>
        </div>
      </header>

      {goFurther ? (
        <div className={styles.secondStageContainer}>
          <div className={`${styles.previousPage} ${darkTheme && styles.dark}`}>
            <button
              onClick={() => {
                setGoFurther(false);
              }}
            >
              <FontAwesomeIcon icon={faReply}></FontAwesomeIcon>
            </button>
            <p>Return to previous page</p>
          </div>

          <ul className={`${styles.participantsList} ${darkTheme && styles.dark}`}>
            {participants.map((participant) => (
              <li key={participant.name}>
                <UserImage userName={participant.name} />
                <p>{participant.name}</p>
                <button
                  onClick={() => {
                    handleCheckboxChange(participant);
                  }}
                >
                  <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
                </button>
              </li>
            ))}
          </ul>
          {participants.length > 0 && (
            <div className={`${styles.createButton} ${darkTheme && styles.dark}`}>
              <p>Are you ready? Create new group</p>
              <button onClick={handleSubmit}>
                <FontAwesomeIcon icon={faUsersViewfinder}></FontAwesomeIcon>
              </button>
            </div>
          )}

          <input
            className={`${styles.searchInput} ${darkTheme && styles.dark}`}
            type='text'
            placeholder='Find contacts'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={styles.contactsContainer}>
            {filteredContacts.map((contact) => (
              <div key={contact.name} className={`${styles.contactBox} ${darkTheme && styles.dark}`}>
                <input
                  type='checkbox'
                  checked={participants.some((c) => c._id === contact._id)}
                  onClick={() => handleCheckboxChange(contact)}
                />
                <UserImage userName={contact.name} />
                <h2 className={styles.contactName}>{contact.name}</h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <form className={styles.mainForm}>
            <label className={styles.imageLabel} htmlFor='groupImage'>
              {groupImage ? (
                <img src={URL.createObjectURL(groupImage)} alt='' />
              ) : (
                <>
                  <FontAwesomeIcon
                    className={styles.backgroundIcon}
                    icon={faPeopleGroup}
                  ></FontAwesomeIcon>
                  <div className={styles.imageBox}>
                    <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>
                    <p>Add group image</p>
                  </div>
                </>
              )}
            </label>
            <input
              type='file'
              id='groupImage'
              accept='image/*'
              onChange={handleImageChange}
              required
            />

            <label htmlFor='groupName'>
              <input
                className={`${darkTheme && styles.dark}`}
                type='text'
                id='groupName'
                value={groupName}
                onChange={handleNameChange}
                placeholder='Group Name'
                required
              />
            </label>

            {groupName.trim() !== '' && (
              <button
                className={styles.goFurtherButton}
                disabled={groupName.trim() === ''}
                onClick={() => {
                  setGoFurther(true);
                }}
              >
                <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon>
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default NewGroup;
