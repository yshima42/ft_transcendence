import { FC } from 'react';
// import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { AccessTokenProvider } from 'hooks/providers/useAccessTokenProvider';
import { AuthProvider } from 'hooks/providers/useAuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { Router } from 'router/Router';
import theme from './theme/theme';

const App: FC = () => {
  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <AccessTokenProvider>
              <Router />
            </AccessTokenProvider>
          </AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
    </div>
  );
};

export default App;
