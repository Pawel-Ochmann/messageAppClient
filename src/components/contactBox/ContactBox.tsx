import { ConversationType } from '../../types';
import { hasBeenRead, numberOfUnreadMessages } from '../../utils/lastRead';
import getConversationName from '../../utils/getConversationName';
import { useContext } from 'react';
import { UserContext } from '../../Context';
import UserImage from '../userImage/UserImage';
import GroupImage from '../groupImage/GroupImage';
import styles from './contactBox.module.css';
import { getLastMessageContent, getLastMessageDate } from '../../utils/getLastMessageInfo';
import classNames from 'classnames';

interface Props {
  conversation: ConversationType;
  setChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
}

const ContactBox = ({
  conversation,
  setChatOpen,
}:Props) => {
  const { user } = useContext(UserContext);

  const classes = {
    buttonWrapper: styles.buttonWrapper,
    contactBox: styles.contactBox,
    image: styles.image,
    contactName: styles.contactName,
    date: classNames(styles.date, {
      [styles.unread]: !hasBeenRead(conversation),
    }),
    unread:styles.unread,
    lastMessage: styles.lastMessage,
    numberOfUnread: styles.numberOfUnread,
  };


  return (
    <button
      className={classes.buttonWrapper}
      onClick={() => setChatOpen(conversation)}
    >
      <div className={classes.contactBox}>
        <div className={classes.image}>
          {conversation.group ? (
            <GroupImage conversation={conversation} />
          ) : (
            user && (
              <UserImage userName={getConversationName(user, conversation)} />
            )
          )}
        </div>
        <h3 className={classes.contactName}>
          {user && getConversationName(user, conversation)}
        </h3>
        <p
          className={`${classes.date} ${
            !hasBeenRead(conversation) && classes.unread
          }`}
        >
          {getLastMessageDate(conversation)}
        </p>
        <p
          className={classes.lastMessage}
        >
          {getLastMessageContent(conversation)}
        </p>
        {!hasBeenRead(conversation) && (
          <p className={classes.numberOfUnread}>
            {numberOfUnreadMessages(conversation)}
          </p>
        )}
      </div>
    </button>
  );
};

export default ContactBox;
