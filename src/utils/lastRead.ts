import { ConversationType } from '../types';

export const updateLastRead = (chatOpen: ConversationType | null) => {
  if (!chatOpen) return;

  const lastMessageDate = chatOpen.messages[chatOpen.messages.length - 1]?.date;

  type LastRead = {
    [key: string]: string;
  };

  const lastRead: LastRead = JSON.parse(
    localStorage.getItem('lastRead') || '{}'
  );
  if (typeof lastMessageDate === 'string')
    lastRead[chatOpen.key] = lastMessageDate;
  localStorage.setItem('lastRead', JSON.stringify(lastRead));
};

export const hasBeenRead = (chatOpen: ConversationType) => {
  if (!chatOpen || !chatOpen.messages) return false;
  if (chatOpen.messages.length === 0) return true;
  const lastRead: Record<string, string> = JSON.parse(
    localStorage.getItem('lastRead') || '{}'
  );
  const lastReadDate = lastRead[chatOpen.key];
  const latestMessageDateAsString =
    chatOpen.messages[chatOpen.messages.length - 1]?.date.toString();
  return lastReadDate === latestMessageDateAsString;
};

export const numberOfUnreadMessages = (conversation: ConversationType) => {
  if (!conversation || !conversation.messages) return 0;
  if (conversation.messages.length === 0) return 0;

  const lastRead: Record<string, string> = JSON.parse(
    localStorage.getItem('lastRead') || '{}'
  );
  const lastReadDate = lastRead[conversation.key];
  if (!lastReadDate) return 0;
  let unreadMessages = 0;
  conversation.messages.forEach((message) => {
    const dateFormatted = new Date(lastReadDate);
    if (typeof message.date === 'string') {
      if ((message.date as string) > dateFormatted.toISOString()) {
        unreadMessages++;
      }
    }
  });
  return unreadMessages;
};
