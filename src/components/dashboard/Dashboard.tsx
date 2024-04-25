import Contacts from '../contacts/Contacts';
import UserImage from '../userImage/UserImage';
import { useState, Dispatch, SetStateAction, useContext } from 'react';
import NewGroup from '../newGroup/NewGroup';
import NewContact from '../newContact/NewContact';
import Settings from '../settings/Settings';
import { ConversationType } from '../../types';
import { Socket } from 'socket.io-client';
import { UserContext } from '../../Context';
import styles from './styles/dashboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faUsersLine,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  socket: Socket;
  newGroup: boolean;
  openNewGroup: Dispatch<SetStateAction<boolean>>;
}

const Dashboard = ({ setChatOpen, socket, newGroup, openNewGroup }: Props) => {
  const { user, darkTheme } = useContext(UserContext);
  const [newContact, setNewContact] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <header className={`${styles.header} ${darkTheme && styles.dark}`}>
        <h1 className={styles.title}>WhatsUp</h1>
        {user && <UserImage userName={user.name} />}
        <div className={styles.menu}>
          <button
            onClick={() => {
              setNewContact(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add new chat</span>
          </button>
          <button
            onClick={() => {
              openNewGroup(true);
            }}
          >
            <FontAwesomeIcon icon={faUsersLine} />
            <span>Create new group</span>
          </button>
          <button
            onClick={() => {
              setSettingsOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
            <span>Settings</span>
          </button>
        </div>
      </header>

      <NewGroup
        setChatOpen={setChatOpen}
        openHandler={openNewGroup}
        socket={socket}
        className={`${newGroup && styles.open}`}
      />

      <NewContact
        className={`${newContact && styles.open}`}
        setChatOpen={setChatOpen}
        openHandler={setNewContact}
      />

      <Contacts setChatOpen={setChatOpen} />
      <Settings
        className={`${settingsOpen && styles.open}`}
        openHandler={setSettingsOpen}
      />
    </div>
  );
};

export default Dashboard;
