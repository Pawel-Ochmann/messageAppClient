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
  id: string;
  name: string;
}

const NewGroup = ({
  setChatOpen,
  openHandler,
  socket
}: {
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  openHandler: Dispatch<SetStateAction<boolean>>;
  socket:Socket
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
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
      key:uuid(),
      messages: [],
      participants: [user._id, ...participants.map((e)=>{return e.id})],
      group: true,
      name: [groupName],
    };
    console.log(newConversation);
    await socket.emit('createNewConversation', newConversation, (confirmation: boolean) => {
      if (confirmation && groupImage) {
           const reader = new FileReader();
           reader.onload = () => {
             const imageDataUrl = reader.result as string;
             socket.emit(
               'setGroupImage', newConversation.key,
               imageDataUrl,
               (confirmation: boolean) => {
                 if (!confirmation) {
                   console.error('Error: Group image could not be set');
                 }
               }
             );
           };

           reader.readAsDataURL(groupImage);
      } else if (confirmation){console.log('Group created')}
      else {
        console.error('Error: New chat creation confirmation failed');
      }
    });
    setGroupName('');
    setGroupImage(null);
    setChatOpen(newConversation);
    navigate('/');
  };

  const addParticipant = (contact:Contact) => {
    if (!participants.some((participant)=>{participant.id === contact.id})) {
      setParticipants([...participants, contact]);
    }
  };

  const removeParticipant = (contact:Contact) => {
    setParticipants(participants.filter((participant) => participant.id !== contact.id));
  };

  return (
    <div>
      <h2>Here you can set new group</h2>
      <button onClick={() => openHandler(false)}>Close new Group</button>
      {goFurther ? (
        <div>
          <ul>
            {participants.map((participant) => (
              <li key={participant.id}>
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
          <ul>
            {contacts.map((contact) => (
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
