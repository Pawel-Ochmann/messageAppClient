export default function Emotes({message, setMessage}:{message:string, setMessage:React.Dispatch<React.SetStateAction<string>>}) {

      const handleEmoteClick = (emote:string) => {
        setMessage(message + emote);
      };

    return (
      <>
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
      </>
    );
}