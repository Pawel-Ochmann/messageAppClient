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
import styles from './styles/conversation.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {faFaceLaugh, faImage} from '@fortawesome/free-regular-svg-icons';
import UserImage from './UserImage';
import GroupImage from './GroupImage';
import moment from 'moment';

const Conversation = ({
  chatOpen,
  setChatOpen,
  socket,
}: {
  chatOpen: ConversationType | null;
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  socket: Socket;
}) => {
  const { user } = useContext(UserContext) as { user: User };
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [lastTimeSeen, setLastTimeSeen] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserIsTyping, setOtherUserIsTyping] = useState('');
  const lastMessageRef = useRef<HTMLParagraphElement>(null);
  const [openEmotes, setOpenEmotes] = useState(false);
  const [openGifs, setOpenGifs] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  
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
        const anotherUser = getConversationName(user, chatOpen);
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
    return <div className={styles.container}></div>;
  }

  return (
    <div className={`${styles.container} ${chatOpen && styles.open}`}>
      <header className={styles.header}>
        <button className={styles.buttonBack} onClick={() => setChatOpen(null)}>
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>
        {chatOpen.group ? (
          <GroupImage conversation={chatOpen} />
        ) : (
          <UserImage userName={getConversationName(user, chatOpen)} />
        )}
        <div className={styles.info}>
          {chatOpen.new ? (
            <h2>Create new chat with {getConversationName(user, chatOpen)}</h2>
          ) : (
            <h2>{getConversationName(user, chatOpen)}</h2>
          )}
          <p>{moment(lastTimeSeen).fromNow()}</p>
        </div>
      </header>
      <div className={styles.messageContainer}>
        {chatOpen.messages &&
          chatOpen.messages.map((message) => (
            <MessageBox
              key={message._id}
              message={message}
              group={chatOpen.group}
            />
          ))}
        <p ref={lastMessageRef}>{otherUserIsTyping}</p>
      </div>
      <div className={styles.footer}>
        <div className={styles.inputContainer}>
          <Emotes
            message={newMessage}
            setMessage={setNewMessage}
            isOpen={openEmotes}
            setIsOpen={setOpenEmotes}
          />
          <Gifs sendGif={sendGif} isOpen={openGifs} />
          <button
            onClick={() => {
              setOpenEmotes(!openEmotes);
            }}
          >
            <FontAwesomeIcon icon={faFaceLaugh}></FontAwesomeIcon>
          </button>
          <button
            onClick={() => {
              setOpenGifs(!openGifs);
            }}
          >
            gif
          </button>
          <button
            type='submit'
            onClick={() => {
              handleImageUpload;
            }}
          >
            <FontAwesomeIcon icon={faImage}></FontAwesomeIcon>
          </button>
          <input
            type='text'
            name='content'
            placeholder='Message'
            value={newMessage}
            onChange={handleInputChange}
          />
        </div>
        {newMessage ? (
          <button onClick={newMessageHandler}>Send Message</button>
        ) : (
          <AudioRecorder
            sendAudio={audioHandler}
            audioChunks={audioChunks}
            setAudioChunks={setAudioChunks}
          />
        )}
      </div>
      {/* <div>
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
      </div> */}
    </div>
  );
};

export default Conversation;
