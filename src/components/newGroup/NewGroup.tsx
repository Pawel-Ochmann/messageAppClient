import { useState, useEffect, useContext } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context';
import UserImage from '../userImage/UserImage';
import { v4 as uuid } from 'uuid';
import { ConversationType } from '../../types/index';
import { Socket } from 'socket.io-client';
import styles from './styles/newGroup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchContactsApi } from '../../api/fetchContactsApi';
import { createNewGroup } from '../../utils/createNewGroup';
import classNames from 'classnames';
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

interface Props {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  openHandler: Dispatch<SetStateAction<boolean>>;
  socket: Socket;
  className: string;
}

const NewGroup = ({ setChatOpen, openHandler, socket, className }: Props) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const { user, darkTheme } = useContext(UserContext);
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState<Contact[]>([]);
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [goFurther, setGoFurther] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsData = await fetchContactsApi(user);
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        navigate('/login');
        return;
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
    await createNewGroup({ socket, newConversation, groupImage });
    setChatOpen(newConversation);
    openHandler(false);
  };

  const handleCheckboxChange = (contact: Contact) => {
    if (participants.some((c) => c._id === contact._id)) {
      setParticipants([...participants.filter((c) => c.name !== contact.name)]);
    } else {
      setParticipants([...participants, contact]);
    }
  };

  const classes = {
    container: classNames(className, styles.container, {
      [styles.dark]: darkTheme,
    }),
    header: classNames(styles.header, { [styles.dark]: darkTheme }),
    buttonBack: styles.buttonBack,
    info: styles.info,
    secondStageContainer: classNames(styles.secondStageContainer, {
      [styles.dark]: darkTheme,
    }),
    previousPage: classNames(styles.previousPage, { [styles.dark]: darkTheme }),
    participantsList: classNames(styles.participantsList, {
      [styles.dark]: darkTheme,
    }),
    createButton: classNames(styles.createButton, { [styles.dark]: darkTheme }),
    searchInput: classNames(styles.searchInput, { [styles.dark]: darkTheme }),
    contactsContainer: styles.contactsContainer,
    contactBox: classNames(styles.contactBox, { [styles.dark]: darkTheme }),
    contactName: styles.contactName,
    mainForm: styles.mainForm,
    imageLabel: styles.imageLabel,
    backgroundIcon: styles.backgroundIcon,
    imageBox: styles.imageBox,
    dark: styles.dark,
    goFurtherButton: styles.goFurtherButton,
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <button
          className={classes.buttonBack}
          onClick={() => openHandler(false)}
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>
        <div className={classes.info}>
          <h2>Create new Group</h2>
        </div>
      </header>

      {goFurther ? (
        <div className={classes.secondStageContainer}>
          <div className={classes.previousPage}>
            <button
              onClick={() => {
                setGoFurther(false);
              }}
            >
              <FontAwesomeIcon icon={faReply}></FontAwesomeIcon>
            </button>
            <p>Return to previous page</p>
          </div>

          <ul className={classes.participantsList}>
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
            <div className={classes.createButton}>
              <p>Are you ready? Create new group</p>
              <button onClick={handleSubmit}>
                <FontAwesomeIcon icon={faUsersViewfinder}></FontAwesomeIcon>
              </button>
            </div>
          )}

          <input
            className={classes.searchInput}
            type='text'
            placeholder='Find contacts'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={classes.contactsContainer}>
            {filteredContacts.map((contact) => (
              <div key={contact.name} className={classes.contactBox}>
                <input
                  type='checkbox'
                  checked={participants.some((c) => c._id === contact._id)}
                  onClick={() => handleCheckboxChange(contact)}
                />
                <UserImage userName={contact.name} />
                <h2 className={classes.contactName}>{contact.name}</h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <form className={classes.mainForm}>
            <label className={classes.imageLabel} htmlFor='groupImage'>
              {groupImage ? (
                <img src={URL.createObjectURL(groupImage)} alt='' />
              ) : (
                <>
                  <FontAwesomeIcon
                    className={classes.backgroundIcon}
                    icon={faPeopleGroup}
                  ></FontAwesomeIcon>
                  <div className={classes.imageBox}>
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
                className={classes.dark}
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
                className={classes.goFurtherButton}
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
