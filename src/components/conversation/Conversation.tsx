import React, {
  MouseEventHandler,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { UserContext } from '../../Context';
import Emotes from '../emotes/Emotes';
import Gifs from '../gifs/Gifs';
import AudioRecorder from '../audioInput/AudioInput';
import MessageBox from '../messageBox/MessageBox';
import { Socket } from 'socket.io-client';
import {
  Message,
  MessageParam,
  User,
  ConversationType,
} from '../../types/index';
import getConversationName from '../../utils/getConversationName';
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
import UserImage from '../userImage/UserImage';
import GroupImage from '../groupImage/GroupImage';
import moment from 'moment';
import { useSending } from '../../hooks/useSending';

interface Props {
  chatOpen: ConversationType | null;
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  socket: Socket;
}

const Conversation = ({ chatOpen, setChatOpen, socket }: Props) => {
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
  const [firstRender, setFirstRender] = useState(true);
  const { sendText, sendGif, sendImage, sendAudio } = useSending({
    socket,
    chatOpen,
  });

  const sendAndCreate = (callback: () => void) => {
    socket.emit('createNewConversation', chatOpen, (confirmation: boolean) => {
      if (confirmation) {
        callback();
      } else {
        console.error('Error: New chat creation confirmation failed');
      }
    });
  };

  useEffect(() => {
    if (!firstRender) {
      lastMessageRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    } else {
      setFirstRender(false);
    }
  }, [chatOpen, firstRender]);

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
    const messageToSend: Message = {
      author: user.name,
      content: message.content,
      type: message.type,
      date: new Date(),
    };

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

  const sendTextHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (chatOpen && chatOpen.new) {
      sendAndCreate(() => {
        sendText(newMessage);
        setNewMessage('');
      });
    } else {
      sendText(newMessage);
      setNewMessage('');
    }
  };

  const sendGifHandler: MouseEventHandler<HTMLImageElement> = (e) => {
    const img = e.target as HTMLImageElement;
    const address = img.src;

    if (chatOpen && chatOpen.new) {
      sendAndCreate(() => {
        sendGif(address);
      });
    } else {
      sendGif(address);
    }
  };

  const sendImageHandler: MouseEventHandler = (e) => {
    e.preventDefault();
    if (chatOpen && chatOpen.new) {
      sendAndCreate(() => {
        sendImage(image);
      });
    } else {
      sendImage(image);
      setImage(null);
    }
  };
  const sendAudioHandler = () => {
    if (chatOpen && chatOpen.new) {
      sendAndCreate(() => {
        sendAudio(audioChunks);
        setAudioChunks([]);
      });
    } else {
      sendAudio(audioChunks);
      setAudioChunks([]);
    }
  };

  const sendOnEnterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage({ type: 'text', content: newMessage });
      setNewMessage('');
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
          />
          <Gifs sendGif={sendGifHandler} isOpen={openGifs} />
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
                  sendImageHandler(e);
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
              onKeyDown={sendOnEnterHandler}
            />
          </div>
          {newMessage ? (
            <button className={styles.sendButton} onClick={sendTextHandler}>
              <FontAwesomeIcon icon={faLocationArrow}></FontAwesomeIcon>
            </button>
          ) : (
            <AudioRecorder
              sendAudio={sendAudioHandler}
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
