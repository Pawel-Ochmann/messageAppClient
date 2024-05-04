import Contacts from '../contacts/Contacts';
import UserImage from '../userImage/UserImage';
import { useState, Dispatch, SetStateAction, useContext } from 'react';
import NewGroup from '../newGroup/NewGroup';
import NewContact from '../newContact/NewContact';
import Settings from '../settings/Settings';
import { ConversationType } from '../../types';
import { Socket } from 'socket.io-client';
import { UserContext } from '../../Context';
import styles from './dashboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faUsersLine,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

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

  const classes = {
    container: styles.container,
    header: classNames(styles.header, { [styles.dark]: darkTheme }),
    title: styles.title,
    menu: styles.menu,
    newGroup: classNames({ [styles.open]: newGroup }),
    newContact: classNames({ [styles.open]: newContact }),
    settings: classNames({ [styles.open]: settingsOpen }),
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <h1 className={classes.title}>WhatsUp</h1>
        {user && <UserImage userName={user.name} />}
        <div className={classes.menu}>
          <button
            aria-label='Add new chat'
            onClick={() => {
              setNewContact(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add new chat</span>
          </button>
          <button
            aria-label='Create new group'
            onClick={() => {
              openNewGroup(true);
            }}
          >
            <FontAwesomeIcon icon={faUsersLine} />
            <span>Create new group</span>
          </button>
          <button
            aria-label='Settings'
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
        className={classes.newGroup}
      />

      <NewContact
        className={classes.newContact}
        setChatOpen={setChatOpen}
        openHandler={setNewContact}
      />

      <Contacts setChatOpen={setChatOpen} />
      <Settings className={classes.settings} openHandler={setSettingsOpen} />
    </div>
  );
};

export default Dashboard;
