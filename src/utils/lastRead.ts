import { ConversationType } from '../types';

export const updateLastRead = (chatOpen: ConversationType | null) => {
  if (!chatOpen) return;

  const lastMessageDate = chatOpen.messages[chatOpen.messages.length - 1]?.date;

    type LastRead = {
      [key: string]: string;
    };

  const lastRead:LastRead = JSON.parse(localStorage.getItem('lastRead') || '{}');
  if (typeof(lastMessageDate) === 'string')  lastRead[chatOpen.key] = lastMessageDate;
  localStorage.setItem('lastRead', JSON.stringify(lastRead));
};

export const hasBeenRead = (chatOpen: ConversationType) => {
  if (!chatOpen) return false;
  const lastRead: Record<string, string> = JSON.parse(
    localStorage.getItem('lastRead') || '{}'
  );
  const lastReadDate = lastRead[chatOpen.key];
  const latestMessageDateAsString =
    chatOpen.messages[chatOpen.messages.length - 1]?.date.toString();
  return lastReadDate === latestMessageDateAsString;
};
