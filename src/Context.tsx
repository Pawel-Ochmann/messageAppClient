import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { User } from './types/index';

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  darkTheme: boolean; 
  setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialUser = {
  name: '',
  password:'',
  _id:'',
  lastVisited: new Date(),
  conversations:[],
  groupConversations:[]
}

const initialUserContextValue: UserContextType = {
  user: initialUser,
  setUser: () => {},
  darkTheme: false, 
  setDarkTheme: () => {},
};

export const UserContext = createContext<UserContextType>(
  initialUserContextValue
);


const Context = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [darkTheme, setDarkTheme] = useState<boolean>(() => {
  const localStorageDarkTheme = localStorage.getItem('darkTheme');
    if (localStorageDarkTheme !== null) {
      return JSON.parse(localStorageDarkTheme);
    } else {
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
  });

  useEffect(() => {
    localStorage.setItem('darkTheme', JSON.stringify(darkTheme));
  }, [darkTheme]);

  return (
    <UserContext.Provider value={{ user, setUser, darkTheme, setDarkTheme }}>
      {children}
    </UserContext.Provider>
  );
};

export default Context;
