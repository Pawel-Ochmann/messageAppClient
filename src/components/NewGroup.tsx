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
import { Socket } from 'socket.io-client';

interface Contact {
  _id: string;
  name: string;
}

const NewGroup = ({
  setChatOpen,
  openHandler,
  socket,
}: {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  openHandler: Dispatch<SetStateAction<boolean>>;
  socket: Socket;
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as { user: User };
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

  const addParticipant = (contact: Contact) => {
    if (!participants.some((participant) => participant._id === contact._id)) {
      setContacts(contacts.filter((c) => c._id !== contact._id));
      setParticipants([...participants, contact]);
    }
  };

  const removeParticipant = (contact: Contact) => {
    setParticipants(
      participants.filter((participant) => participant._id !== contact._id)
    );
    setContacts([...contacts, contact]);
  };

  return (
    <div>
      <h2>Here you can set new group</h2>
      <button onClick={() => openHandler(false)}>Close new Group</button>
      {goFurther ? (
        <div>
          <ul>
            {participants.map((participant) => (
              <li key={participant._id}>
                <button
                  style={{ color: 'green' }}
                  onClick={() => {
                    removeParticipant(participant);
                  }}
                >
                  {participant.name}
                </button>
              </li>
            ))}
          </ul>
          <input
            type='text'
            placeholder='Search contacts'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul>
            {filteredContacts.map((contact) => (
              <li key={contact.name}>
                <button
                  onClick={() => {
                    addParticipant(contact);
                  }}
                >
                  {contact.name}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleSubmit}>Create Group</button>
          <button
            onClick={() => {
              setGoFurther(false);
            }}
          >
            Go back
          </button>
        </div>
      ) : (
        <div>
          <h2>Create Group</h2>
          <form>
            <div>
              <label htmlFor='groupName'>Group Name:</label>
              <input
                type='text'
                id='groupName'
                value={groupName}
                onChange={handleNameChange}
                required
              />
            </div>
            <div>
              <label htmlFor='groupImage'>Group Image:</label>
              <input
                type='file'
                id='groupImage'
                accept='image/*'
                onChange={handleImageChange}
                required
              />
            </div>
          </form>
          <button
            disabled={groupName.trim() === ''}
            onClick={() => {
              setGoFurther(true);
            }}
          >
            Go further
          </button>
        </div>
      )}
    </div>
  );
};

export default NewGroup;
