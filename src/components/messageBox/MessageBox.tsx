import { MessageBackend } from '../types/index';
import { getAddress } from '../utils/serverAddress';
import styles from './styles/messageBox.module.css';
import { useContext } from 'react';
import { UserContext } from '../Context';
import { User } from '../types/index';
import moment from 'moment';

const MessageBox = ({ message, group }: { message: MessageBackend, group:boolean }) => {
  const { user, darkTheme } = useContext(UserContext) as { user: User, darkTheme:boolean };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <div>{message.content}</div>;
      case 'image':
        return <img src={getAddress(`/${message.content}`)} alt='Image' crossOrigin=''/>;
      case 'gif':
        return <img src={message.content} alt='GIF' />;
      case 'audio':
        return <audio controls src={getAddress(`/${message.content}`)} crossOrigin=''/>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.messageContainer} ${
        message.author === user.name ? styles.messageUser : styles.messageOther
      } ${darkTheme && styles.dark}`}
    >
      <h2>{group && message.author}</h2>
      {renderMessageContent()}
      <p className={styles.date}>
        {moment(message.date.toString()).format('MMMM Do YYYY, h:mm:ss a')}
      </p>
    </div>
  );
};

export default MessageBox;