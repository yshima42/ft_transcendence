import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { MainLayout } from 'components/environments/MainLayout/MainLayout';
import { Login } from 'features/auth/routes/Login';
import { OtpAuth } from 'features/auth/routes/OtpAuth';
import { Page404 } from 'features/auth/routes/Page404';
import { SignUp } from 'features/auth/routes/SignUp';
import { UnexpectedError } from 'features/auth/routes/UnexpectedError';
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
import { InGameList } from 'features/game/routes/InGameList';
import { Inviting } from 'features/game/routes/Inviting';
import { Matching } from 'features/game/routes/Matching';
import { Top } from 'features/game/routes/Top';
import { Profile } from 'features/profile/routes/Profile';
import SocketProvider from 'providers/SocketProvider';

const App = () => {
  return (
    // TODO:AppProviderファイルに書きたい。認証後にオンライン状態にしたいのでここに書いている。ルーティング周りのリファクタ時に修正する。
    <Suspense fallback={<CenterSpinner h="100vh" />}>
      <SocketProvider>
        <MainLayout>
          <Suspense fallback={<CenterSpinner h="100vh" />}>
            <Outlet />
          </Suspense>
        </MainLayout>
      </SocketProvider>
    </Suspense>
  );
};

export const publicRoutes = [
  // authを入れる場合は
  {
    path: '/',
    element: <Login />,
  },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/otp', element: <OtpAuth /> },
  { path: '*', element: <Page404 /> },
  { path: 'error', element: <UnexpectedError /> },
  {
    path: '/app',
    element: <App />,
    children: [
      { path: 'users', element: <Users /> },
      { path: 'chat/rooms', element: <ChatRooms /> },
      { path: 'chat/rooms/me', element: <ChatRoomsMe /> },
      { path: 'chat/rooms/create', element: <CreateChatRooms /> },
      { path: 'chat/rooms/:chatRoomId', element: <ChatRoom /> },
      {
        path: 'chat/rooms/:chatRoomId/settings',
        element: <ChatRoomSettings />,
      },
      {
        path: 'chat/rooms/:chatRoomId/confirmation',
        element: <ChatRoomConfirmation />,
      },
      { path: 'games', element: <InGameList /> },
      { path: 'games/:id', element: <Game /> },
      { path: '', element: <Top /> },
      { path: 'matching', element: <Matching /> },
      { path: 'inviting', element: <Inviting /> },
      { path: 'dm/rooms', element: <DmRooms /> },
      { path: 'dm/rooms/:chatRoomId', element: <DmRoom /> },
      { path: 'profile', element: <Profile /> },
      { path: 'users/:id', element: <Profile /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
