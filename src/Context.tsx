import React, { createContext, ReactNode, useState } from 'react';
import { User, ConversationType} from './types/index';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  conversations: ConversationType[],
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationType[]>
  >;
}

const initialUserContextValue: UserContextType = {
  user: null,
  setUser: () => {},
  conversations:[],
  setConversations:()=>{}
};

export const UserContext = createContext<UserContextType>(
  initialUserContextValue
);


const Context = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  return (
    <UserContext.Provider value={{ user, setUser, conversations, setConversations }}>
      {children}
    </UserContext.Provider>
  );
};

export default Context;
