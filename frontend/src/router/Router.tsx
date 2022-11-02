import { Route, Routes } from 'react-router-dom';
import { ChatRoomList } from 'components/pages/ChatRoomList';
import { FriendList } from 'components/pages/FriendList';
import { GameSelect } from 'components/pages/GameSelect';
import { HeaderLayout } from 'components/templates/HeaderLayout';
import { Login } from '../components/pages/Login';
import { Page404 } from '../components/pages/Page404';

export const Router = (): React.ReactElement | null => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/chatroom-list"
        element={
          <HeaderLayout>
            <ChatRoomList />
          </HeaderLayout>
        }
      />
      <Route path="/friend-list" element={<FriendList />} />
      <Route path="/game-select" element={<GameSelect />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
