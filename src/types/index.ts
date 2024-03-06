export type Message = {
  author: string;
  content?: string;
  type: 'text' | 'image' | 'gif' | 'audio';
  date: Date;
  id?:string
};

export type MessageParam = {
  type: 'text' | 'image' | 'gif' | 'audio';
  content: string;
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