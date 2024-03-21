import React, {
  MouseEventHandler,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { UserContext } from '../Context';
import Emotes from '../components/Emotes';
import Gifs from '../components/Gifs';
import AudioRecorder from './AudioInput';
import MessageBox from './MessageBox';
import { Socket } from 'socket.io-client';
import { Message, MessageParam, User, ConversationType } from '../types/index';
import getConversationName from '../utils/getConversationName';

const Conversation = ({
  chatOpen,
  socket,
}: {
  chatOpen: ConversationType | null;
  socket: Socket;
}) => {
  const { user } = useContext(UserContext) as { user: User };
  const [newMessage, setNewMessage] = useState('');
  const [extrasOpen, setExtrasOpen] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [lastTimeSeen, setLastTimeSeen] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserIsTyping, setOtherUserIsTyping] = useState('');
  const lastMessageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [chatOpen]);

  const sendTyping = () => {
    if (isTyping) return;
    if (chatOpen) {
      socket.emit('typing', getConversationName(user, chatOpen), user.name);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  useEffect(() => {
    socket.on('typing', (userName: string) => {
      if (chatOpen) {
        const anotherUser = getConversationName(user, chatOpen)
        if (anotherUser === userName) {
          setOtherUserIsTyping(
            `${getConversationName(user, chatOpen)} is typing...`
          );
          setTimeout(() => {
            setOtherUserIsTyping('');
          }, 2000);
        }
      }
    });
    return () => {
      socket.off('typing');
    };
  }, [chatOpen, socket, user]);

  useEffect(() => {
    if (chatOpen && !chatOpen.group) {
      const otherParticipant = getConversationName(user, chatOpen);
      console.log(otherParticipant);
      socket.emit('getStatus', otherParticipant, (status: string) => {
        setLastTimeSeen(status);
      });
    }
  }, [chatOpen, socket, user]);

  const renderExtras = () => {
    switch (extrasOpen) {
      case 1:
        return <Emotes message={newMessage} setMessage={setNewMessage} />;
      case 2:
        return <Gifs sendGif={sendGif} />;
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

    socket ? socket.emit('newMessage', messageToSend, chatOpen?.key) : '';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewMessage(e.target.value);
    if (!chatOpen?.group) {
      sendTyping();
    }
  };

  const newMessageHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (chatOpen && chatOpen.new) {
      socket.emit(
        'createNewConversation',
        chatOpen,
        (confirmation: boolean) => {
          if (confirmation) {
            sendMessage({ type: 'text', content: newMessage });
            setNewMessage('');
          } else {
            console.error('Error: New chat creation confirmation failed');
          }
        }
      );
    } else {
      sendMessage({ type: 'text', content: newMessage });
      setNewMessage('');
    }
  };

  const sendGif: MouseEventHandler<HTMLImageElement> = (e) => {
    const img = e.target as HTMLImageElement;

    if (chatOpen && chatOpen.new) {
      socket.emit(
        'createNewChatConfirmation',
        chatOpen,
        (confirmation: boolean) => {
          if (confirmation) {
            const address = img.src;
            sendMessage({ type: 'gif', content: address });
          } else {
            console.error('Error: New chat creation confirmation failed');
          }
        }
      );
    } else {
      const address = img.src;
      sendMessage({ type: 'gif', content: address });
    }
  };

  const handleImageUpload: MouseEventHandler = (e) => {
    e.preventDefault();

    const uploadImage = () => {
      if (image) {
        const reader = new FileReader();
        reader.onload = () => {
          sendMessage({ type: 'image', content: image });
        };
        reader.readAsDataURL(image);
      }
    };

    if (chatOpen && chatOpen.new) {
      socket.emit(
        'createNewConversation',
        chatOpen,
        (confirmation: boolean) => {
          if (confirmation) {
            uploadImage();
          } else {
            console.error('Error: New chat creation confirmation failed');
          }
        }
      );
    } else {
      uploadImage();
    }
  };
  const audioHandler = () => {
    const sendAudio = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], 'audio_recording.webm', {
        type: 'audio/webm',
      });

      const newMessage: MessageParam = {
        type: 'audio',
        content: audioFile,
      };
      sendMessage(newMessage);
    };

    if (chatOpen && chatOpen.new) {
      socket.emit(
        'createNewChatConfirmation',
        chatOpen,
        (confirmation: boolean) => {
          if (confirmation) {
            sendAudio();
          } else {
            console.error('Error: New chat creation confirmation failed');
          }
        }
      );
    } else {
      sendAudio();
    }
  };

  if (!chatOpen) {
    return <div>There is no conversation yet.</div>;
  }

  return (
    <div>
      {chatOpen.new ? (
        <h2>Create new chat with {getConversationName(user, chatOpen)}</h2>
      ) : (
        <>
          <h2>{getConversationName(user, chatOpen)}</h2>
          <p>{lastTimeSeen}</p>
        </>
      )}

      <ul style={{ overflow: 'scroll' }}>
        {chatOpen.messages &&
          chatOpen.messages.map((message) => (
            <li key={message._id}>
              <MessageBox message={message} />
            </li>
          ))}
        <p ref={lastMessageRef}>{otherUserIsTyping}</p>
      </ul>
      <div>
        <input
          type='text'
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
          <button
            type='submit'
            onClick={() => {
              handleImageUpload;
            }}
          >
            Add an image
          </button>
        </form>
      </div>
      <AudioRecorder
        sendAudio={audioHandler}
        audioChunks={audioChunks}
        setAudioChunks={setAudioChunks}
      />
      <div>
        <button onClick={newMessageHandler}>Send Message</button>
      </div>
    </div>
  );
};

export default Conversation;
