import React, { createContext, ReactNode, useState } from 'react';
import { User } from './types/index';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const initialUserContextValue: UserContextType = {
  user: null,
  setUser: () => {},
};

export const UserContext = createContext<UserContextType>(
  initialUserContextValue
);

const Context = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default Context;
