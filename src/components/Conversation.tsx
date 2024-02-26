import React, { useState } from 'react';

type Message = {
  author: string;
  content: string;
  date: Date;
};

const Conversation = ({ messages }: { messages: Message[]}) => {
  const [newMessage, setNewMessage] = useState<Message>({
    author: '',
    content: '',
    date: new Date(),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewMessage({
      ...newMessage,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendMessage = () => {
    if (newMessage.content.trim() !== '') {
      setNewMessage({ author: '', content: '', date: new Date() });
    }
  };

  return (
    <div>
      <ul>
        {messages && messages.map((message, index) => (
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
      <div>
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default Conversation;
