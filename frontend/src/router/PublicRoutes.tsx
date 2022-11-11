import { ChatRoomList } from 'components/pages/ChatRoomList';
import { DirectMessage } from 'components/pages/DirectMessage';
import { Game } from 'components/pages/Game';
import { GameSelect } from 'components/pages/GameSelect';
import { Login } from 'components/pages/Login';
import { Page404 } from 'components/pages/Page404';
import { ProfilePage } from 'components/pages/ProfilePage';
import { UserList } from 'components/pages/UserList';
import { HeaderLayout } from 'components/templates/HeaderLayout';

export const publicRoutes = [
  // authを入れる場合は
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/',
    element: <HeaderLayout />,
    children: [
      { path: 'user-list', element: <UserList /> },
      { path: 'chatroom-list', element: <ChatRoomList /> },
      { path: 'game-select', element: <GameSelect /> },
      { path: 'game', element: <Game /> },
      { path: 'direct-message', element: <DirectMessage /> },
      { path: 'profile-page', element: <ProfilePage /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
