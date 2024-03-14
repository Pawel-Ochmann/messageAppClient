import React, { MouseEventHandler, useState, useContext } from 'react';
import { UserContext } from '../Context';
import Emotes from '../components/Emotes';
import Gifs from '../components/Gifs';
import AudioRecorder from './AudioInput';
import MessageBox from './MessageBox';
import { v4 as uuid4 } from 'uuid';
import { Socket } from 'socket.io-client';
import { Message, MessageParam, User, ConversationType} from '../types/index';


const Conversation = ({
  chatOpen,
  socket,
}: {
  chatOpen:ConversationType | null,
  socket:Socket;
}) => {
  const {user} = useContext(UserContext) as {user:User};
  const [newMessage, setNewMessage] = useState('');
  const [extrasOpen, setExtrasOpen] = useState(0);
  const [image, setImage] = useState<File | null>(null);



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

    const sendMessage = (message: MessageParam) => {
      const messageToSend: Message = {
        author: user.name,
        content: message.content,
        type: message.type,
        date: new Date(),
      };

      console.log(message);

      if (message.type === 'image' || message.type === 'audio') {
        const formData = new FormData();
        formData.append('file', message.content);
      }
      socket ? socket.emit('newMessage', messageToSend) : '';
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

  const handleImageUpload: MouseEventHandler = (e) => {
    e.preventDefault();

    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        sendMessage({ type: 'image', content: image });
      };
      reader.readAsDataURL(image);
    }
  };

  

  if (!chatOpen) {
    return <div>There is no conversation yet.</div>;
  }

  return (
    <div>
      <button onClick={()=>{console.log(chatOpen)}}>check chat</button>
      {chatOpen.id === '' ? `Create new chat with ${chatOpen.name}`: chatOpen.name}
      <ul>
        {chatOpen.messages &&
          chatOpen.messages.map((message) => (
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
          <input
            type='file'
            multiple={false}
            accept='image/*'
            onChange={(e) => {
              const selectedFile = e.target.files && e.target.files[0];
              setImage(selectedFile);
            }}
          />
          <button type='submit' onClick={handleImageUpload}>
            Add an image
          </button>
        </form>
      </div>
      <AudioRecorder sendMessage={sendMessage}/>
      <div>
        <button onClick={newMessageHandler}>Send Message</button>
      </div>
    </div>
  );
};

export default Conversation;
