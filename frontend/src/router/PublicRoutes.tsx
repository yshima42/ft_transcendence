import { Outlet } from 'react-router-dom';
import { ChatRoomList } from 'components/pages/ChatRoomList';
import { DirectMessage } from 'components/pages/DirectMessage';
import { Game } from 'components/pages/Game';
import { GameSelect } from 'components/pages/GameSelect';
import { Login } from 'components/pages/Login';
import { Page404 } from 'components/pages/Page404';
import { Profile } from 'components/pages/Profile';
import { UserList } from 'components/pages/UserList';
import { MainLayout } from 'components/templates/MainLayout';

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
      { path: 'user-list', element: <UserList /> },
      { path: 'chatroom-list', element: <ChatRoomList /> },
      { path: 'game-select', element: <GameSelect /> },
      { path: 'game', element: <Game /> },
      { path: 'direct-message', element: <DirectMessage /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
