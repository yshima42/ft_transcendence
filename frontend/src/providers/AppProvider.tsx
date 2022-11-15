import { FC, memo } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { AuthProvider } from 'hooks/useAuthProvider';
import { BrowserRouter } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export const AppProvider: FC<Props> = memo((props) => {
  const { children } = props;

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
});
