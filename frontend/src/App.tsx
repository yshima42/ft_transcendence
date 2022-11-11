import { FC } from 'react';
// import './App.css';
import { AppProvider } from 'providers/app';
import { AppRoutes } from 'router/AppRoutes';

const App: FC = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
