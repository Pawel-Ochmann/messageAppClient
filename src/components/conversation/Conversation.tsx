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
import { ConversationType } from '../../types/index';
import getConversationName from '../../utils/getConversationName';
import styles from './conversation.module.css';
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
import { useTypingInfo } from '../../hooks/useTypingInfo';
import classNames from 'classnames';

interface Props {
  chatOpen: ConversationType | null;
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  socket: Socket;
}

const Conversation = ({ chatOpen, setChatOpen, socket }: Props) => {
  const { user, darkTheme } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [lastTimeSeen, setLastTimeSeen] = useState<string>('');
  const lastMessageRef = useRef<HTMLParagraphElement>(null);
  const [openEmotes, setOpenEmotes] = useState(false);
  const [openGifs, setOpenGifs] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const { sendAndCreate, sendText, sendGif, sendImage, sendAudio } = useSending(
    {
      socket,
      chatOpen,
    }
  );
  const { sendTyping, otherUserIsTyping } = useTypingInfo({ socket, chatOpen });

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

  useEffect(() => {
    if (chatOpen && !chatOpen.group) {
      const otherParticipant = getConversationName(user, chatOpen);
      socket.emit('getStatus', otherParticipant, (status: string) => {
        setLastTimeSeen(status);
      });
    }
  }, [chatOpen, socket, user]);

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
      if (chatOpen && chatOpen.new) {
        sendAndCreate(() => {
          sendText(newMessage);
          setNewMessage('');
        });
      } else {
        sendText(newMessage);
        setNewMessage('');
      }
    }
  };

  const classes = {
    containerEmpty: classNames(styles.container, { [styles.dark]: darkTheme }),
    startingBoardClass: classNames(styles.startingBoard, {
      [styles.dark]: darkTheme,
    }),
    container: classNames(
      styles.container,
      { [styles.dark]: darkTheme },
      { [styles.open]: chatOpen }
    ),
    header: classNames(styles.header, { [styles.dark]: darkTheme }),
    buttonBack: styles.buttonBack,
    info: styles.info,
    messageContainer: styles.messageContainer,
    userTyping: classNames(styles.userTyping, { [styles.dark]: darkTheme }),
    footer: styles.footer,
    inputContainer: styles.inputContainer,
    imageForm: classNames(
      styles.imageForm,
      { [styles.open]: openFile },
      { [styles.dark]: darkTheme }
    ),
    active: classNames({ [styles.active]: image }),
    dashboard: classNames(styles.dashboard, { [styles.dark]: darkTheme }),
    gifButton: styles.gifButton,
    sendButton: classNames(styles.sendButton, { [styles.dark]: darkTheme }),
  };

  if (!chatOpen) {
    return (
      <div className={classes.containerEmpty}>
        <div className={classes.startingBoardClass}>
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
    <div className={classes.container}>
      <header className={classes.header}>
        <button
          aria-label='Close this chat'
          className={classes.buttonBack}
          onClick={() => setChatOpen(null)}
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>
        {chatOpen.group ? (
          <GroupImage conversation={chatOpen} />
        ) : (
          <UserImage userName={getConversationName(user, chatOpen)} />
        )}
        <div className={classes.info}>
          {chatOpen.new ? (
            <h2>Create new chat with {getConversationName(user, chatOpen)}</h2>
          ) : (
            <h2>{getConversationName(user, chatOpen)}</h2>
          )}
          <p>
            {lastTimeSeen === 'active'
              ? 'active'
              : moment(new Date(lastTimeSeen)).fromNow()}
          </p>
        </div>
      </header>
      <div className={classes.messageContainer}>
        {chatOpen.messages &&
          chatOpen.messages.map((message) => (
            <MessageBox
              key={message._id}
              message={message}
              group={chatOpen.group}
            />
          ))}
        {otherUserIsTyping && (
          <div className={classes.userTyping}>
            <p>{otherUserIsTyping}</p>
          </div>
        )}
        <p ref={lastMessageRef}></p>
      </div>
      <div className={classes.footer}>
        <div className={classes.inputContainer}>
          <Emotes
            message={newMessage}
            setMessage={setNewMessage}
            isOpen={openEmotes}
          />
          <Gifs sendGif={sendGifHandler} isOpen={openGifs} />
          <div className={classes.imageForm} aria-hidden={!openFile}>
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
                aria-label='Send image'
                disabled={!image}
                className={classes.active}
                type='submit'
                onClick={(e) => {
                  sendImageHandler(e);
                }}
              >
                <FontAwesomeIcon icon={faShare}></FontAwesomeIcon>
              </button>
            </form>
          </div>
          <div className={classes.dashboard}>
            <button
              aria-label={!openEmotes ? 'Open emotes pop-up' : 'Close emotes pop-up'}
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
              aria-label={!openGifs ? 'Open gif pop-up': 'Close gif pop-up'}
              onClick={() => {
                setOpenEmotes(false);
                setOpenFile(false);
                setOpenGifs(!openGifs);
              }}
            >
              {openGifs ? (
                <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
              ) : (
                <button className={classes.gifButton}>gif</button>
              )}
            </button>
            <button
              aria-label={!openFile ? 'Open sending image pop-up': 'Close sending image pop-up'}
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
            <button aria-label='Send a message' className={classes.sendButton} onClick={sendTextHandler}>
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
