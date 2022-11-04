import { Route, Routes } from 'react-router-dom';
import { ChatRoomList } from 'components/pages/ChatRoomList';
import { DirectMessage } from 'components/pages/DirectMessage';
import { Game } from 'components/pages/Game';
import { GameSelect } from 'components/pages/GameSelect';
import { UserList } from 'components/pages/UserList';
import { HeaderLayout } from 'components/templates/HeaderLayout';
import { Login } from '../components/pages/Login';
import { Page404 } from '../components/pages/Page404';

export const Router = (): React.ReactElement | null => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* mapで処理する */}
      <Route
        path="chatroom-list"
        element={
          <HeaderLayout>
            <ChatRoomList />
          </HeaderLayout>
        }
      />
      <Route
        path="user-list"
        element={
          <HeaderLayout>
            <UserList />
          </HeaderLayout>
        }
      />
      <Route
        path="game-select"
        element={
          <HeaderLayout>
            <GameSelect />
          </HeaderLayout>
        }
      />
      <Route
        path="game"
        element={
          <HeaderLayout>
            <Game />
          </HeaderLayout>
        }
      />
      <Route
        path="direct-message"
        element={
          <HeaderLayout>
            <DirectMessage />
          </HeaderLayout>
        }
      />
      <Route
        path="*"
        element={
          <HeaderLayout>
            <Page404 />
          </HeaderLayout>
        }
      />
    </Routes>
  );
};
