import { Suspense } from 'react';
import { useToast } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, useNavigate } from 'react-router-dom';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { MainLayout } from 'components/environments/MainLayout/MainLayout';
import { Login } from 'features/auth/routes/Login';
import { OtpAuth } from 'features/auth/routes/OtpAuth';
import { Page404 } from 'features/auth/routes/Page404';
import { UnexpectedError } from 'features/auth/routes/UnexpectedError';
import { ChatRoom } from 'features/chat/routes/ChatRoom';
import { ChatRooms } from 'features/chat/routes/ChatRooms';
import { CreateChatRooms } from 'features/chat/routes/CreateChatRooms';
import { DmRoom } from 'features/dm/routes/DmRoom';
import { DmRooms } from 'features/dm/routes/DmRooms';
import { Users } from 'features/friends/routes/Users';
import { Matching } from 'features/game/components/Matching';
import { Games } from 'features/game/routes/Games';
import { Top } from 'features/game/routes/Top';
import { Profile } from 'features/profile/routes/Profile';
import { ProfileEdit } from 'features/profile/routes/ProfileEdit';
import OnlineUsersProvider from 'providers/OnlineUsersProvider';

const App = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const onError = (error: Error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      toast({
        title: 'Error',
        description: 'Authentication failed.',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } else {
      navigate('/error');
    }
  };

  return (
    // TODO:AppProviderファイルに書きたい。認証後にオンライン状態にしたいのでここに書いている。ルーティング周りのリファクタ時に修正する。
    <ErrorBoundary
      fallback={<CenterSpinner h={'100vh'} color="red.500" />}
      onError={onError}
    >
      <Suspense fallback={<CenterSpinner h={'100vh'} />}>
        <OnlineUsersProvider>
          <MainLayout>
            <Suspense fallback={<CenterSpinner h={'100vh'} />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        </OnlineUsersProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export const publicRoutes = [
  // authを入れる場合は
  {
    path: '/',
    element: <Login />,
  },
  { path: '/otp', element: <OtpAuth /> },
  { path: '*', element: <Page404 /> },
  { path: 'error', element: <UnexpectedError /> },
  {
    path: '/app',
    element: <App />,
    children: [
      { path: 'users', element: <Users /> },
      { path: 'chat', element: <ChatRooms /> },
      { path: 'chat/create', element: <CreateChatRooms /> },
      { path: 'chat/:id', element: <ChatRoom /> },
      { path: 'games', element: <Games /> },
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
