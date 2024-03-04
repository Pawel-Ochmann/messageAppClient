import React, { useState } from 'react';
import Emotes from '../components/Emotes';
import Gifs from '../components/Gifs';

type Message = {
  author: string;
  content: string;
  date: Date;
};

type SendMessageHandler = (message:string) => void;

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
        return <Emotes message={newMessage} setMessage={setNewMessage}/>;
      case 2:
        return <Gifs />;
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
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <ul>
        {messages &&
          messages.map((message, index) => (
            <li key={index}>
              <div>Author: {message.author}</div>
              <div>Content: {message.content}</div>
              <div>Date: {message.date.toString()}</div>
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
        <input type='file' />
        <button>Add an image</button>
      </div>
      <div>
        <button onClick={newMessageHandler}>Send Message</button>
      </div>
    </div>
  );
};

export default Conversation;
