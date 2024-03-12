import React, { ReactNode, createContext, useState } from 'react';

interface UserContextType {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const initialUserContextValue: UserContextType = {
  name: '',
  setName: () => {},
};

export const UserContext = createContext<UserContextType>(
  initialUserContextValue
);

const Context = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>(' ');

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
};

export default Context;
