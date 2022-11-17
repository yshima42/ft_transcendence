// 現在は使っていない

import { createContext, useContext, useState } from 'react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

type AuthContextType = {
  user: string;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
};

// あまり良くない書き方とのことなので、後ほど検討(参考：https://qiita.com/johnmackay150/items/88654e5064290c24a32a)
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType>({
  user: '',
  signin: (newUser: string, callback: VoidFunction) => {
    callback();
  },
  signout: (callback: VoidFunction) => {
    callback();
  },
});

const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): ReactJSXElement => {
  const [user, setUser] = useState('');

  const signin = (newUser: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  const signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser('');
      callback();
    });
  };

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
