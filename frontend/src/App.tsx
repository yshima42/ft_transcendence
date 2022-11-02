import { FC } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { Router } from 'router/Router';
import theme from './theme/theme';

const App: FC = () => {
  return (
    <div className="App">
      <h1>ft_transcendence</h1>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ChakraProvider>
    </div>
  );
};

export default App;
