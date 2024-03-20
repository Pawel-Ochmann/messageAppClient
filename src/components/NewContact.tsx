import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { getToken } from '../utils/tokenHandler';
import { getAddress } from '../utils/serverAddress';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context';
import {User} from '../types/index'
import { v4 as uuid } from 'uuid';
import { ConversationType } from '../types/index';

interface Contact {
  _id: string;
  name: string;
}

const NewContact = ({
  setChatOpen,
  openHandler,
}: {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  openHandler: Dispatch<SetStateAction<boolean>>;
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]); 
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as {user:User};

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

  const createNewConversation = (_id:string, name:string)=> {
    const newConversation:ConversationType = {
      key:uuid(),
      messages:[],
      participants:[user._id, _id],
      name:[user.name, name],
      group:false,
      new:true,
    };
    setChatOpen(newConversation);setChatOpen(newConversation);
  }


  return (
    <div>
      <h2>Here you can set new contact</h2>
      <button onClick={() => openHandler(false)}>Close new contact</button>
      <input
        type='text'
        placeholder='Search contacts'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filteredContacts.map((contact) => (
          <li key={uuid()}>
            <button
              onClick={() => {
                createNewConversation(contact._id, contact.name);
              }}
            >
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewContact;
