import { FC } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Router } from 'router/Router';

const App: FC = () => {
  return (
    <div className="App">
      <h1>ft_transcendence</h1>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
};

export default App;
