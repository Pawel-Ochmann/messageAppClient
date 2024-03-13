import Contacts from "./Contacts";
import UserImage from "./UserImage";
import {useState} from 'react';
import NewGroup from "./NewGroup";
import NewContact from "./NewContact";
import { useNavigate } from "react-router-dom";
import { deleteToken } from "../utils/tokenHandler";

const Dashboard = () => {
    const [newContact, setNewContact] = useState(false);
    const [newGroup, setNewGroup]=useState(false)
    const navigate = useNavigate();

    const logOut = ()=> {
      deleteToken();
      navigate('/login');
    }

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
          setNewGroup(true);
        }}
      >
        Add group
      </button>
      <button>Settings</button>
      <button onClick={logOut}>log out</button>
      {newGroup && <NewGroup />}
      {newContact && <NewContact openHandler={setNewContact} />}
      <Contacts />
    </div>
  );
};

export default Dashboard;
