import { Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from 'components/environments/MainLayout/MainLayout';
import { Login } from 'features/auth/routes/Login';
import { OtpAuth } from 'features/auth/routes/OtpAuth';
import { Page404 } from 'features/auth/routes/Page404';
import { ChatRoom } from 'features/chat/routes/ChatRoom';
import { ChatRoomConfirmation } from 'features/chat/routes/ChatRoomConfirmation';
import { ChatRoomSettings } from 'features/chat/routes/ChatRoomSettings';
import { ChatRooms } from 'features/chat/routes/ChatRooms';
import { ChatRoomsMe } from 'features/chat/routes/ChatRoomsMe';
import { CreateChatRooms } from 'features/chat/routes/CreateChatRooms';
import { DmRoom } from 'features/dm/routes/DmRoom';
import { DmRooms } from 'features/dm/routes/DmRooms';
import { Users } from 'features/friends/routes/Users';
import { Game } from 'features/game/routes/Game';
import { GameTop } from 'features/game/routes/GameTop';
import { Games } from 'features/game/routes/Games';
import { Matching } from 'features/game/routes/Matching';
import { Profile } from 'features/profile/routes/Profile';
import { ProfileEdit } from 'features/profile/routes/ProfileEdit';
import OnlineUsersProvider from 'providers/OnlineUsersProvider';

const App = () => {
  return (
    // TODO:AppProviderファイルに書きたい。認証後にオンライン状態にしたいのでここに書いている。ルーティング周りのリファクタ時に修正する。
    <OnlineUsersProvider>
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
    </OnlineUsersProvider>
  );
};

export const publicRoutes = [
  // authを入れる場合は
  {
    path: '/',
    element: <Login />,
  },
  { path: '/otp', element: <OtpAuth /> },
  { path: '/app/game', element: <Game /> },
  { path: '*', element: <Page404 /> },
  {
    path: '/app',
    element: <App />,
    children: [
      { path: 'users', element: <Users /> },
      { path: 'chat/me', element: <ChatRoomsMe /> },
      { path: 'chat', element: <ChatRooms /> },
      { path: 'chat/create', element: <CreateChatRooms /> },
      { path: 'chat/rooms/:id', element: <ChatRoom /> },
      { path: 'chat/rooms/:id/settings', element: <ChatRoomSettings /> },
      {
        path: 'chat/rooms/:id/confirmation',
        element: <ChatRoomConfirmation />,
      },
      { path: 'games', element: <Games /> },
      { path: '', element: <GameTop /> },
      { path: 'matching', element: <Matching /> },
      { path: 'dm', element: <DmRooms /> },
      { path: 'dm/rooms/:id', element: <DmRoom /> },
      { path: 'profile', element: <Profile /> },
      { path: 'profile/edit', element: <ProfileEdit /> },
      { path: 'users/:id', element: <Profile /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
