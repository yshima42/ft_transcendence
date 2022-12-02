import { Outlet } from 'react-router-dom';
import { MainLayout } from 'components/environments/MainLayout/MainLayout';
import { Login } from 'features/auth/routes/Login';
import { Page404 } from 'features/auth/routes/Page404';
import { TwoFactorAuth } from 'features/auth/routes/TwoFactorAuth';
import { Chats } from 'features/chat/routes/Chats';
import { DirectMessage } from 'features/dm/routes/DirectMessage';
import { Users } from 'features/friends/routes/Users';
import { Game } from 'features/game/routes/Game';
import { GameTop } from 'features/game/routes/GameTop';
import { Games } from 'features/game/routes/Games';
import { Matching } from 'features/game/routes/Matching';
import { Profile } from 'features/profile/routes/Profile';
import { ProfileEdit } from 'features/profile/routes/ProfileEdit';
import { UserProfile } from 'features/users/routes/UserProfile';

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
  { path: '/twofactor', element: <TwoFactorAuth /> },
  { path: '/app/game', element: <Game /> },
  { path: '*', element: <Page404 /> },
  {
    path: '/app',
    element: <App />,
    children: [
      { path: 'users', element: <Users /> },
      { path: 'chats', element: <Chats /> },
      { path: 'games', element: <Games /> },
      { path: '', element: <GameTop /> },
      { path: 'matching', element: <Matching /> },
      { path: 'dm/*', element: <DirectMessage /> },
      { path: 'profile', element: <Profile /> },
      { path: 'profile/edit', element: <ProfileEdit /> },
      { path: 'users/:id', element: <UserProfile /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
