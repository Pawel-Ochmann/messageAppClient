import Contacts from "./Contacts";
import UserImage from "./UserImage";
import {useState, Dispatch, SetStateAction} from 'react';
import NewGroup from "./NewGroup";
import NewContact from "./NewContact";
import { useNavigate } from "react-router-dom";
import { deleteToken } from "../utils/tokenHandler";
import { ConversationType } from "../types";
import { Socket } from 'socket.io-client';

const Dashboard = ({
  setChatOpen,
  socket,
  newGroup,
  openNewGroup
}: {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  socket: Socket;
  newGroup:boolean;
  openNewGroup: Dispatch<SetStateAction<boolean>>;
}) => {
  const [newContact, setNewContact] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    deleteToken();
    navigate('/login');
  };

  return (
    <div>
      <UserImage />
      <button
        onClick={() => {
          setNewContact(true);
        }}
      >
        Add contact
      </button>
      <button
        onClick={() => {
          openNewGroup(true);
        }}
      >
        Add group
      </button>
      <button>Settings</button>
      <button onClick={logOut}>log out</button>
      {newGroup && (
        <NewGroup
          setChatOpen={setChatOpen}
          openHandler={openNewGroup}
          socket={socket}
        />
      )}
      {newContact && (
        <NewContact setChatOpen={setChatOpen} openHandler={openNewGroup} />
      )}
      <Contacts setChatOpen={setChatOpen} />
    </div>
  );
};

export default Dashboard;
