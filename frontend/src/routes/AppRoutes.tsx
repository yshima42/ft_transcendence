import { FC, Suspense } from 'react';
import { AuthRoutes } from 'features/auth/routes';
import { ChatRoutes } from 'features/chat/routes';
import { DmRoutes } from 'features/dm/routes';
import { FriendsRoutes } from 'features/friends/routes';
import { GameRoutes } from 'features/game/routes';
import { ProfileRoutes } from 'features/profile/routes';
import { Outlet, useRoutes } from 'react-router-dom';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { MainLayout } from 'components/environments/MainLayout/MainLayout';
import { Page404 } from 'features/auth/routes/Page404';
import { Top } from 'features/game/routes/Top';
import { ErrorProvider } from 'providers/ErrorProvider';
import SocketProvider from 'providers/SocketProvider';

const App = () => {
  return (
    <ErrorProvider>
      <Suspense fallback={<CenterSpinner h="100vh" />}>
        <SocketProvider>
          <MainLayout>
            <Suspense fallback={<CenterSpinner h="100vh" />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        </SocketProvider>
      </Suspense>
    </ErrorProvider>
  );
};

export const AppRoutes: FC = () => {
  const publicRoutes = [
    { path: '/*', element: <AuthRoutes /> },
    {
      path: '/app',
      element: <App />,
      children: [
        { path: '', element: <Top /> },
        { path: 'users/*', element: <FriendsRoutes /> },
        { path: 'chat/*', element: <ChatRoutes /> },
        { path: 'dm/*', element: <DmRoutes /> },
        { path: 'game/*', element: <GameRoutes /> },
        { path: 'users/:id/*', element: <ProfileRoutes /> },
        { path: '*', element: <Page404 /> },
      ],
    },
  ];

  const element = useRoutes([...publicRoutes]);

  return <>{element}</>;
};
