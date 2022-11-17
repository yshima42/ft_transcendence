import { Stats } from 'features/users/index';
import { UsersRoutes } from 'features/users/routes';
import { Outlet } from 'react-router-dom';
import { MainLayout } from 'components/templates/MainLayout';
import { Login } from 'features/auth/routes/Login';
import { Page404 } from 'features/auth/routes/Page404';
import { Chats } from 'features/chat/routes/Chats';
import { DirectMessage } from 'features/dm/routes/DirectMessage';
import { Game } from 'features/game/routes/Game';
import { GameTop } from 'features/game/routes/GameTop';
import { Games } from 'features/game/routes/Games';
import { Matching } from 'features/game/routes/Matching';

const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const publicRoutes = [
  // authを入れる場合は
  {
    path: '/',
    element: <Login />,
  },
  { path: '/app/game', element: <Game /> },
  { path: '*', element: <Page404 /> },
  {
    path: '/app',
    element: <App />,
    children: [
      { path: 'users/*', element: <UsersRoutes /> },
      { path: 'chats', element: <Chats /> },
      { path: 'games', element: <Games /> },
      { path: '', element: <GameTop /> },
      { path: 'matching', element: <Matching /> },
      { path: 'dm/*', element: <DirectMessage /> },
      { path: 'profile', element: <Stats /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
