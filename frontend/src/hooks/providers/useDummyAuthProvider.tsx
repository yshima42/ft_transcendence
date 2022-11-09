import { createContext, useContext, useState } from 'react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

type DummyAuthContextType = {
  user: string;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
};

// あまり良くない書き方とのことなので、後ほど検討(参考：https://qiita.com/johnmackay150/items/88654e5064290c24a32a)
// const DummyAuthContext = createContext<DummyAuthContextType | undefined>(undefined);
const DummyAuthContext = createContext<DummyAuthContextType>({
  user: '',
  signin: (newUser: string, callback: VoidFunction) => {
    callback();
  },
  signout: (callback: VoidFunction) => {
    callback();
  },
});

const fakeDummyAuthProvider = {
  isDummyAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeDummyAuthProvider.isDummyAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    fakeDummyAuthProvider.isDummyAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export const DummyAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): ReactJSXElement => {
  const [user, setUser] = useState('');

  const signin = (newUser: string, callback: VoidFunction) => {
    return fakeDummyAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  const signout = (callback: VoidFunction) => {
    return fakeDummyAuthProvider.signout(() => {
      setUser('');
      callback();
    });
  };

  const value = { user, signin, signout };

  return (
    <DummyAuthContext.Provider value={value}>
      {children}
    </DummyAuthContext.Provider>
  );
};

export const useDummyAuth = (): DummyAuthContextType => {
  return useContext(DummyAuthContext);
};
