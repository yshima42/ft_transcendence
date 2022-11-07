import { FC } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { Button, ChakraProvider } from '@chakra-ui/react';

const title = import.meta.env.VITE_APP_TITLE;
console.dir(import.meta.env);

// function App () {
const App: FC = () => {
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>ft_transcendence</h1>
      <p>{title}</p>
    </div>
  );
};

export default App;
