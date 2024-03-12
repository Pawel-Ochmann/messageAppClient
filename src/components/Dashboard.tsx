import Contacts from "./Contacts";
import UserImage from "./UserImage";
import {useState} from 'react';
import NewGroup from "./NewGroup";
import NewContact from "./NewContact";

const Dashboard = () => {
    const [newContact, setNewContact] = useState(false);
    const [newGroup, setNewGroup]=useState(false)

  return (
    <div>
    <UserImage />
    <button onClick={()=>{setNewContact(true)}}>Add contact</button>
    <button onClick={()=>{setNewGroup(true)}}>Add group</button>
    <button>Settings</button>
     {newGroup && <NewGroup/>}
     {newContact && <NewContact />}
     <Contacts />
    </div>
  );
};

export default Dashboard;
