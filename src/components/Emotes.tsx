import styles from './styles/emotes.module.css';
import { UserContext } from '../Context';
import { useContext } from 'react';

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
      <span onClick={() => handleEmoteClick('😀')}>😀</span>
      <span onClick={() => handleEmoteClick('😃')}>😃</span>
      <span onClick={() => handleEmoteClick('😄')}>😄</span>
      <span onClick={() => handleEmoteClick('😁')}>😁</span>
      <span onClick={() => handleEmoteClick('😆')}>😆</span>
      <span onClick={() => handleEmoteClick('😅')}>😅</span>
      <span onClick={() => handleEmoteClick('😉')}>😉</span>
      <span onClick={() => handleEmoteClick('😊')}>😊</span>
      <span onClick={() => handleEmoteClick('😋')}>😋</span>
      <span onClick={() => handleEmoteClick('😎')}>😎</span>
      <span onClick={() => handleEmoteClick('😍')}>😍</span>
      <span onClick={() => handleEmoteClick('😘')}>😘</span>
      <span onClick={() => handleEmoteClick('😚')}>😚</span>
      <span onClick={() => handleEmoteClick('😌')}>😌</span>
      <span onClick={() => handleEmoteClick('😜')}>😜</span>
      <span onClick={() => handleEmoteClick('😝')}>😝</span>
      <span onClick={() => handleEmoteClick('😏')}>😏</span>
      <span onClick={() => handleEmoteClick('😒')}>😒</span>
      <span onClick={() => handleEmoteClick('😓')}>😓</span>
      <span onClick={() => handleEmoteClick('😔')}>😔</span>
      <span onClick={() => handleEmoteClick('😞')}>😞</span>
      <span onClick={() => handleEmoteClick('😖')}>😖</span>
      <span onClick={() => handleEmoteClick('😥')}>😥</span>
      <span onClick={() => handleEmoteClick('😰')}>😰</span>
      <span onClick={() => handleEmoteClick('😨')}>😨</span>
      <span onClick={() => handleEmoteClick('😣')}>😣</span>
      <span onClick={() => handleEmoteClick('😢')}>😢</span>
      <span onClick={() => handleEmoteClick('😭')}>😭</span>
      <span onClick={() => handleEmoteClick('😂')}>😂</span>
      <span onClick={() => handleEmoteClick('😲')}>😲</span>
      <span onClick={() => handleEmoteClick('😱')}>😱</span>
      <span onClick={() => handleEmoteClick('😷')}>😷</span>
      <span onClick={() => handleEmoteClick('😪')}>😪</span>
      <span onClick={() => handleEmoteClick('😴')}>😴</span>
      <span onClick={() => handleEmoteClick('💤')}>💤</span>
      <span onClick={() => handleEmoteClick('💩')}>💩</span>
      <span onClick={() => handleEmoteClick('😈')}>😈</span>
      <span onClick={() => handleEmoteClick('👿')}>👿</span>
      <span onClick={() => handleEmoteClick('👹')}>👹</span>
      <span onClick={() => handleEmoteClick('👺')}>👺</span>
      <span onClick={() => handleEmoteClick('💀')}>💀</span>
      <span onClick={() => handleEmoteClick('👻')}>👻</span>
      <span onClick={() => handleEmoteClick('👽')}>👽</span>
      <span onClick={() => handleEmoteClick('🤖')}>🤖</span>
      <span onClick={() => handleEmoteClick('💩')}>💩</span>
      <span onClick={() => handleEmoteClick('😸')}>😸</span>
      <span onClick={() => handleEmoteClick('😹')}>😹</span>
      <span onClick={() => handleEmoteClick('😺')}>😺</span>
      <span onClick={() => handleEmoteClick('😻')}>😻</span>
      <span onClick={() => handleEmoteClick('😼')}>😼</span>
      <span onClick={() => handleEmoteClick('😽')}>😽</span>
      <span onClick={() => handleEmoteClick('🙀')}>🙀</span>
      <span onClick={() => handleEmoteClick('😿')}>😿</span>
      <span onClick={() => handleEmoteClick('😾')}>😾</span>
      <span onClick={() => handleEmoteClick('🤗')}>🤗</span>
      <span onClick={() => handleEmoteClick('🤔')}>🤔</span>
      <span onClick={() => handleEmoteClick('🤐')}>🤐</span>
      <span onClick={() => handleEmoteClick('🤓')}>🤓</span>
    </div>
  );
}