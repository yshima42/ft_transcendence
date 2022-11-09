import React, { createContext, useState, FC } from 'react';

type Props = {
  children: React.ReactNode;
};

type AccessTokenContextType = {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
};

const defaultAccessTokenContext: AccessTokenContextType = {
  accessToken: '',
  setAccessToken: () => {}, // eslint-disable-line
};

export const AccessTokenContext = createContext<AccessTokenContextType>(
  defaultAccessTokenContext
);

export const AccessTokenProvider: FC<Props> = (props) => {
  const { children } = props;

  const [accessToken, setAccessToken] = useState('');

  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};
