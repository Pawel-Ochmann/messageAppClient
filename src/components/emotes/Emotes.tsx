import styles from './emotes.module.css';
import { UserContext } from '../../Context';
import { useContext } from 'react';
import { emotesList } from './emotesList';
import classNames from 'classnames';

interface Props {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
}

export default function Emotes({ setMessage, isOpen }: Props) {
  const { darkTheme } = useContext(UserContext);

  const handleEmoteClick = (emote: string) => {
    setMessage((message)=>{ return message + emote});
  };

  const classes = {
    emotesContainer: classNames(styles.emotesContainer, {
      [styles.open]: isOpen,
      [styles.dark]: darkTheme,
    }),
  };

  return (
    <div
      className={classes.emotesContainer}
    >
      {emotesList.map((emote) => {
        return (
          <button
            onClick={() => {
              handleEmoteClick(emote);
            }}
          >
            {emote}
          </button>
        );
      })}
    </div>
  );
}
