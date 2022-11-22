import { Outlet } from 'react-router-dom';
import { MainLayout } from 'components/layout/MainLayout/MainLayout';
import { Login } from 'features/auth/routes/Login';
import { Page404 } from 'features/auth/routes/Page404';
import { Chats } from 'features/chat/routes/Chats';
import { DirectMessage } from 'features/dm/routes/DirectMessage';
import { Friends } from 'features/friends/routes/Friends';
import { Game } from 'features/game/routes/Game';
import { GameTop } from 'features/game/routes/GameTop';
import { Games } from 'features/game/routes/Games';
import { Matching } from 'features/game/routes/Matching';
import { Profile } from 'features/profile/routes/Profile';
import { Stats } from 'features/users/routes/Stats';

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
      { path: 'users', element: <Friends /> },
      { path: 'chats', element: <Chats /> },
      { path: 'games', element: <Games /> },
      { path: '', element: <GameTop /> },
      { path: 'matching', element: <Matching /> },
      { path: 'dm/*', element: <DirectMessage /> },
      { path: 'users/profile', element: <Profile /> },
      { path: 'users/:id', element: <Stats /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
