import { MessageBackend } from '../../types/index';
import { getAddress } from '../../utils/serverAddress';
import styles from './styles/messageBox.module.css';
import { useContext, useCallback } from 'react';
import { UserContext } from '../../Context';
import { User } from '../../types/index';
import moment from 'moment';
import classNames from 'classnames';

const MessageBox = ({ message, group }: { message: MessageBackend, group:boolean }) => {
  const { user, darkTheme } = useContext(UserContext) as { user: User, darkTheme:boolean };

  const renderMessageContent = useCallback(() => {
    switch (message.type) {
      case 'text':
        return <div>{message.content}</div>;
      case 'image':
        return (
          <img
            src={getAddress(`/${message.content}`)}
            alt='Image'
            crossOrigin=''
          />
        );
      case 'gif':
        return <img src={message.content} alt='GIF' />;
      case 'audio':
        return (
          <audio
            controls
            src={getAddress(`/${message.content}`)}
            crossOrigin=''
          />
        );
      default:
        return null;
    }
  }, [message.type, message.content]);

  const classes = {
    messageContainer: classNames(
      styles.messageContainer,
      {
        [styles.messageUser]: message.author === user.name,
        [styles.messageOther]: message.author !== user.name,
      },
      { [styles.dark]: darkTheme }
    ),
    date:styles.date
  };

  return (
    <div
      className={classes.messageContainer}
    >
      <h2>{group && message.author}</h2>
      {renderMessageContent()}
      <p className={classes.date}>
        {moment(message.date.toString()).format('MMMM Do YYYY, h:mm:ss a')}
      </p>
    </div>
  );
};

export default MessageBox;
