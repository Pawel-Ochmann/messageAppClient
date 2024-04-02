import Contacts from './Contacts';
import UserImage from './UserImage';
import { useState, Dispatch, SetStateAction, useContext } from 'react';
import NewGroup from './NewGroup';
import NewContact from './NewContact';
import { useNavigate } from 'react-router-dom';
import { deleteToken } from '../utils/tokenHandler';
import { ConversationType } from '../types';
import { Socket } from 'socket.io-client';
import { UserContext } from '../Context';
import styles from './styles/dashboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faUsersLine,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = ({
  setChatOpen,
  socket,
  newGroup,
  openNewGroup,
}: {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  socket: Socket;
  newGroup: boolean;
  openNewGroup: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useContext(UserContext);
  const [newContact, setNewContact] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    deleteToken();
    navigate('/login');
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>WhatsUp</h1>
        {user && <UserImage userName={user.name} />}
        <div className={styles.menu}>
          <button
            onClick={() => {
              setNewContact(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button
            onClick={() => {
              openNewGroup(true);
            }}
          >
            <FontAwesomeIcon icon={faUsersLine} />
          </button>
          <button onClick={logOut}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
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
    </>
  );
};

export default Dashboard;
