import React, { useState } from 'react';
import Emotes from '../components/Emotes';
import Gifs from '../components/Gifs';

type Message = {
  author: string;
  content: string;
  date: Date;
};

type SendMessageHandler = (message: Message) => void;

const Conversation = ({
  messages,
  sendMessage,
}: {
  messages: Message[];
  sendMessage: SendMessageHandler;
}) => {
  const [newMessage, setNewMessage] = useState<Message>({
    author: '',
    content: '',
    date: new Date(),
  });
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
    setNewMessage({
      ...newMessage,
      [e.target.name]: e.target.value,
    });
  };

  const newMessageHandler = () => {
    console.log('sending message: ', newMessage);
    sendMessage(newMessage);
    setNewMessage({ author: '', content: '', date: new Date() });
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
        <input
          type='text'
          name='author'
          placeholder='Author'
          value={newMessage.author}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <textarea
          name='content'
          placeholder='Message'
          value={newMessage.content}
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
