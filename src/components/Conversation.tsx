import React, { useState } from 'react';
import Emotes from '../components/Emotes';
import Gifs from '../components/Gifs';
import MessageBox from './MessageBox';
import { v4 as uuid4 } from 'uuid';
import { Message, SendMessageHandler } from '../types/index';

const Conversation = ({
  messages,
  sendMessage,
}: {
  messages: Message[];
  sendMessage: SendMessageHandler;
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [extrasOpen, setExtrasOpen] = useState(0);

  const renderExtras = () => {
    switch (extrasOpen) {
      case 1:
        return <Emotes message={newMessage} setMessage={setNewMessage} />;
      case 2:
        return <Gifs sendMessage={sendMessage} />;
      default:
        return null;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewMessage(e.target.value);
  };

  const newMessageHandler = () => {
    sendMessage({ type: 'text', content: newMessage });
    setNewMessage('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result as string;
          sendMessage({ type: 'image', content: imageData });
        };
      } else {
        alert('Please select an image file (jpg, png, etc)');
      }
    }
  };

  return (
    <div>
      <ul>
        {messages &&
          messages.map((message) => (
            <li key={uuid4()}>
              <MessageBox message={message} />
            </li>
          ))}
      </ul>
      <div>
        <textarea
          name='content'
          placeholder='Message'
          value={newMessage}
          onChange={handleInputChange}
        />
      </div>
      <div>{renderExtras()}</div>
      <div>
        <button
          onClick={() => {
            extrasOpen === 0 ? setExtrasOpen(1) : setExtrasOpen(0);
          }}
        >
          Add an emote
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            extrasOpen === 0 ? setExtrasOpen(2) : setExtrasOpen(0);
          }}
        >
          Add a gif
        </button>
      </div>
      <div>
        <form>
          <input type='file' onChange={handleImageUpload} />
          <button type='submit'>Add an image</button>
        </form>
      </div>
      <div>
        <button onClick={newMessageHandler}>Send Message</button>
      </div>
    </div>
  );
};

export default Conversation;
