import styles from './styles/emotes.module.css';
import { UserContext } from '../../Context';
import { useContext } from 'react';
import { emotesList } from './emotesList';

export default function Emotes({
  message,
  setMessage,
  isOpen
}: {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {


  const { darkTheme} = useContext(UserContext);

  const handleEmoteClick = (emote: string) => {
    setMessage(message + emote);
  };

  return (
    <div className={`${styles.emotesContainer} ${isOpen && styles.open} ${darkTheme && styles.dark}`}>
     {emotesList.map((emote)=>{
      return <button onClick={()=>{handleEmoteClick(emote)}}>{emote}</button>
     }) }
    </div>
  );
}