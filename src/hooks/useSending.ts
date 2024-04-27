import { useContext } from 'react';
import { Socket } from 'socket.io-client';
import { MessageParam, Message, ConversationType } from '../types';
import { UserContext } from '../Context';

interface Props {
  socket: Socket;
  chatOpen: ConversationType | null;
}

export const useSending = ({ socket, chatOpen }: Props) => {
  const { user } = useContext(UserContext);

  const sendMessage = (message: MessageParam) => {
    const messageToSend: Message = {
      author: user?.name || '',
      content: message.content,
      type: message.type,
      date: new Date(),
    };

    if (message.type === 'image' || message.type === 'audio') {
      const formData = new FormData();
      formData.append('file', message.content);
    }

    socket ? socket.emit('newMessage', messageToSend, chatOpen?.key) : '';
  };

  const sendText = (newMessage: string) => {
    sendMessage({ type: 'text', content: newMessage });
  };

  const sendGif = (gifAddress: string) => {
    sendMessage({ type: 'gif', content: gifAddress });
  };

  const sendImage = (image: File | null) => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        sendMessage({ type: 'image', content: image });
      };
      reader.readAsDataURL(image);
    }
  };

  const sendAudio = (audioChunks: Blob[]) => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const audioFile = new File([audioBlob], 'audio_recording.webm', {
      type: 'audio/webm',
    });

    const newMessage: MessageParam = {
      type: 'audio',
      content: audioFile,
    };
    sendMessage(newMessage);
  };

  return { sendText, sendGif, sendImage, sendAudio };
};
