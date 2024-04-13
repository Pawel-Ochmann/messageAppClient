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
import {
  faArrowLeft,
  faLocationArrow,
  faFileImage,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFaceLaugh,
  faImage,
  faCircleXmark,
} from '@fortawesome/free-regular-svg-icons';
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
  const { user, darkTheme } = useContext(UserContext) as {
    user: User;
    darkTheme: boolean;
  };
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
    lastMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
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
      socket.emit('getStatus', otherParticipant, (status: string) => {
        setLastTimeSeen(status);
      });
    }
  }, [chatOpen, socket, user]);

  const sendMessage = (message: MessageParam) => {
    console.log('socket', socket);
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
            setImage(null);
          } else {
            console.error('Error: New chat creation confirmation failed');
          }
        }
      );
    } else {
      uploadImage();
      setImage(null);
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
    return (
      <div className={`${styles.container} ${darkTheme && styles.dark}`}>
        <div className={`${styles.startingBoard} ${darkTheme && styles.dark}`}>
          <img src='./chat.png' alt='chat picture' />
          <h2>What's upp</h2>
          <p>
            Ready to start connecting? You can kick off a conversation by either
            creating a new one with a contact, initiate a group chat, or simply
            click on an existing conversation to dive right in.
          </p>
          <p>
            Feel free to explore and engage with your contacts effortlessly! If
            you have any questions, don't hesitate to reach out. Happy chatting!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${darkTheme && styles.dark} ${
        chatOpen && styles.open
      } `}
    > 
      <header className={`${styles.header} ${darkTheme && styles.dark}`}>
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
          <p
            onClick={() => {
              console.log(lastTimeSeen);
            }}
          >
            {lastTimeSeen === 'active'
              ? 'active'
              : moment(new Date(lastTimeSeen)).fromNow()}
          </p>
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
        {otherUserIsTyping && (
          <div className={`${styles.userTyping} ${darkTheme && styles.dark}`}>
            <p>{otherUserIsTyping}</p>
          </div>
        )}
        <p ref={lastMessageRef}></p>
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
          <div
            className={`${styles.imageForm} ${openFile && styles.open} ${
              darkTheme && styles.dark
            }`}
          >
            <form>
              <label htmlFor='image'>
                Add <FontAwesomeIcon icon={faFileImage}></FontAwesomeIcon>
              </label>
              <input
                id='image'
                type='file'
                multiple={false}
                accept='image/*'
                onChange={(e) => {
                  const selectedFile = e.target.files && e.target.files[0];
                  setImage(selectedFile);
                }}
              />
              <button
                disabled={!image}
                className={`${image && styles.active}`}
                type='submit'
                onClick={(e) => {
                  handleImageUpload(e);
                }}
              >
                <FontAwesomeIcon icon={faShare}></FontAwesomeIcon>
              </button>
            </form>
          </div>
          <div className={`${styles.dashboard} ${darkTheme && styles.dark}`}>
            <button
              onClick={() => {
                setOpenGifs(false);
                setOpenFile(false);
                setOpenEmotes(!openEmotes);
              }}
            >
              {openEmotes ? (
                <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon icon={faFaceLaugh}></FontAwesomeIcon>
              )}
            </button>
            <button
              onClick={() => {
                setOpenEmotes(false);
                setOpenFile(false);
                setOpenGifs(!openGifs);
              }}
            >
              {openGifs ? (
                <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
              ) : (
                <button className={styles.gifButton}>gif</button>
              )}
            </button>
            <button
              type='submit'
              onClick={() => {
                setOpenEmotes(false);
                setOpenGifs(false);
                setOpenFile(!openFile);
              }}
            >
              {openFile ? (
                <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon icon={faImage}></FontAwesomeIcon>
              )}
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
            <button className={styles.sendButton} onClick={newMessageHandler}>
              <FontAwesomeIcon icon={faLocationArrow}></FontAwesomeIcon>
            </button>
          ) : (
            <AudioRecorder
              sendAudio={audioHandler}
              audioChunks={audioChunks}
              setAudioChunks={setAudioChunks}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
