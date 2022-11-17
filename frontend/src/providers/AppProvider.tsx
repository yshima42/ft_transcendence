import { FC, memo } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from 'hooks/useAuthProvider';
import { BrowserRouter } from 'react-router-dom';
import theme from '../theme/theme';

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
