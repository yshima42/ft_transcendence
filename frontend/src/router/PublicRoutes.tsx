import { Profile } from 'features/users/index';
import { UsersRoutes } from 'features/users/routes';
import { Outlet } from 'react-router-dom';
// import { DirectMessage } from 'components/pages/DirectMessage';
// import { Game } from 'components/pages/Game';
import { Page404 } from 'components/pages/Page404';
import { MainLayout } from 'components/templates/MainLayout';
import { Login } from 'features/auth/routes/Login';
import { ChatRoomList } from 'features/chat/routes/ChatRoomList';
import { GameSelect } from 'features/game/routes/GameSelect';

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
  { path: '*', element: <Page404 /> },
  {
    path: '/app',
    element: <App />,
    children: [
      { path: 'users/*', element: <UsersRoutes /> },
      { path: 'chatroom-list', element: <ChatRoomList /> },
      { path: 'game-select', element: <GameSelect /> },
      // { path: 'game', element: <Game /> },
      // { path: 'direct-message', element: <DirectMessage /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
