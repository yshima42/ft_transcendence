import { ChatRoomList } from 'components/pages/ChatRoomList';
import { DirectMessage } from 'components/pages/DirectMessage';
import { Game } from 'components/pages/Game';
import { GameSelect } from 'components/pages/GameSelect';
import { Page404 } from 'components/pages/Page404';
import { UserList } from 'components/pages/UserList';
import { HeaderLayout } from 'components/templates/HeaderLayout';

export const protectedRoutes = [
  {
    path: '/',
    element: <HeaderLayout />,
    children: [
      { path: '/user-list', element: <UserList /> },
      { path: 'chatroom-list', element: <ChatRoomList /> },
      { path: 'game-select', element: <GameSelect /> },
      { path: 'game', element: <Game /> },
      { path: 'direct-message', element: <DirectMessage /> },
      { path: '*', element: <Page404 /> },
    ],
  },
];
