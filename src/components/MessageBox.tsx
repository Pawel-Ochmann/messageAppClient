import { Message } from '../types/index';

const MessageBox = ({ message }: { message: Message }) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <div>Text: {message.content}</div>;
      case 'image':
        return <img src={message.content} alt='Image' />;
      case 'gif':
        return <img src={message.content} alt='GIF' />;
      case 'audio':
        return <audio controls src={message.content} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>Author: {message.author}</div>
      {renderMessageContent()}
      <div>Date: {message.date.toString()}</div>
    </div>
  );
};

export default MessageBox;
