import React, { createContext, useState, FC } from 'react';

type Props = {
  children: React.ReactNode;
};

type AccessTokenContextType = {
  token: string;
  setToken: (token: string) => void;
};

const defaultAccessTokenContext: AccessTokenContextType = {
  token: '',
  setToken: () => {}, // eslint-disable-line
};

export const AccessTokenContext = createContext<AccessTokenContextType>(
  defaultAccessTokenContext
);

export const AccessTokenProvider: FC<Props> = (props) => {
  const { children } = props;

  const [token, setToken] = useState('');

  return (
    <AccessTokenContext.Provider value={{ token, setToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};
