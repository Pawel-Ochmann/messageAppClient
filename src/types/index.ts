export type Message = {
  author: string;
  content: string | File;
  type: 'text' | 'image' | 'gif' | 'audio';
  date: Date;
  id?: string;
};

export type MessageBackend = {
  author: string;
  content: string;
  type: 'text' | 'image' | 'gif' | 'audio';
  date: Date;
  _id: string;
};

export type MessageParam = {
  type: 'text' | 'image' | 'gif' | 'audio';
  content: string | File;
};

export type SendMessageHandler = (message: MessageParam) => void;

export type Gif = {
  id: string;
  images: {
    original: {
      url: string;
    };
  };
};

export type ConversationType = {
  key:string;
  messages: MessageBackend[];
  participants: string[];
  group: boolean;
  name: string[];
  new?: boolean;
};

export type User = {
  name: string;
  password:string;
  _id:string,
  lastVisited: Date;
  conversations: ConversationType[];
  groupConversations: { ref: string; name: string }[];
}

