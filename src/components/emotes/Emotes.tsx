import styles from './styles/emotes.module.css';
import { UserContext } from '../../Context';
import { useContext } from 'react';
import { emotesList } from './emotesList';

interface Props {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
}

export default function Emotes({ message, setMessage, isOpen }: Props) {
  const { darkTheme } = useContext(UserContext);

  const handleEmoteClick = (emote: string) => {
    setMessage(message + emote);
  };

  return (
    <div
      className={`${styles.emotesContainer} ${isOpen && styles.open} ${
        darkTheme && styles.dark
      }`}
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
