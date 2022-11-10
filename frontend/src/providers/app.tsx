import { FC, memo } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { AccessTokenProvider } from 'hooks/providers/useAccessTokenProvider';
import { AuthProvider } from 'hooks/providers/useAuthProvider';
import { BrowserRouter } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export const AppProvider: FC<Props> = memo((props) => {
  const { children } = props;

  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <AccessTokenProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </AccessTokenProvider>
        </AuthProvider>
      </ChakraProvider>
    </div>
  );
});
