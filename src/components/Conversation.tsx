import React, {  useState } from 'react';

type Message = {
  author: string;
  content: string;
  date: Date;
};

type SendMessageHandler = (message:Message) => void;

const Conversation = ({ messages, sendMessage }: { messages: Message[], sendMessage:SendMessageHandler}) => {
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

 const newMessageHandler = ()=> {
  console.log('sending message: ', newMessage);
  sendMessage(newMessage);
  setNewMessage({ author: '', content: '', date: new Date() });
 }

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
        <button onClick={newMessageHandler}>Send Message</button>
      </div>
    </div>
  );
};

export default Conversation;
