import { Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from 'components/environments/MainLayout/MainLayout';
import { Login } from 'features/auth/routes/Login';
import { Page404 } from 'features/auth/routes/Page404';
import { TwoFactorAuth } from 'features/auth/routes/TwoFactorAuth';
import { ChatRoom } from 'features/chat/routes/ChatRoom';
import { ChatRooms } from 'features/chat/routes/ChatRooms';
import { CreateChatRooms } from 'features/chat/routes/CreateChatRooms';
import { DmRoom } from 'features/dm/routes/DmRoom';
import { DmRooms } from 'features/dm/routes/DmRooms';
import { Users } from 'features/friends/routes/Users';
import { Game } from 'features/game/routes/Game';
import { Games } from 'features/game/routes/Games';
import { Matching } from 'features/game/routes/Matching';
import { Top } from 'features/game/routes/Top';
import { Profile } from 'features/profile/routes/Profile';
import { ProfileEdit } from 'features/profile/routes/ProfileEdit';

const App = () => {
  return (
    <MainLayout>
      <ErrorBoundary fallback={<Navigate to="." replace={true} />}>
        <Suspense
          fallback={
            <Spinner emptyColor="gray.200" color="blue.500" size="xl" />
          }
        >
          <Outlet />
        </Suspense>
      </ErrorBoundary>
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
  { path: '*', element: <Page404 /> },
  {
    path: '/app',
    element: <App />,
    children: [
      { path: 'users', element: <Users /> },
      { path: 'chat', element: <ChatRooms /> },
      { path: 'chat/create', element: <CreateChatRooms /> },
      { path: 'chat/:id', element: <ChatRoom /> },
      { path: 'games', element: <Games /> },
      { path: 'game', element: <Game /> },
      { path: '', element: <Top /> },
      { path: 'matching', element: <Matching /> },
      { path: 'dm', element: <DmRooms /> },
      { path: 'dm/:id', element: <DmRoom /> },
      { path: 'profile', element: <Profile /> },
      { path: 'profile/edit', element: <ProfileEdit /> },
      // { path: 'users/:id', element: <UserProfile /> },
      { path: 'users/:id', element: <Profile /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
