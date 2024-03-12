import { useState, useEffect } from 'react';
import {v4 as uuid} from 'uuid';


const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('https://api.example.com/contacts'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  return (
    <div>
      <ul>
        {contacts.map((contact) => (
          <li key={uuid()}>
            <strong>{contact}</strong> 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
