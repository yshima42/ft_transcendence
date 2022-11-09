import { Route, Routes } from 'react-router-dom';
import { ChatRoomList } from 'components/pages/ChatRoomList';
import { DirectMessage } from 'components/pages/DirectMessage';
import { Game } from 'components/pages/Game';
import { GameSelect } from 'components/pages/GameSelect';
import { UserList } from 'components/pages/UserList';
import { HeaderLayout } from 'components/templates/HeaderLayout';
import { Login } from '../components/pages/Login';
import { LoginPage } from '../components/pages/LoginPage';
import { Page404 } from '../components/pages/Page404';
import { AuthProvider } from '../hooks/providers/useAuthProvider';
import { ProtectedRoutes } from './ProtectedRoutes';
import { PublicRoutes } from './PublicRoutes';

export const Router = (): React.ReactElement | null => {
  return (
    <AuthProvider>
      <Routes>
        {/** Public Routes */}
        {/** Wrap all Route under PublicRoutes element */}
        <Route path="/" element={<PublicRoutes />}>
          <Route path="/" element={<Login />}>
            <Route path="/login-page" element={<LoginPage />} />
          </Route>
        </Route>

        {/** Protected Routes */}
        {/** Wrap all Route under ProtectedRoutes element */}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="/" element={<HeaderLayout />}>
            <Route path="chatroom-list" element={<ChatRoomList />} />
            <Route path="user-list" element={<UserList />} />
            <Route path="game-select" element={<GameSelect />} />
            <Route path="game" element={<Game />} />
            <Route path="direct-message" element={<DirectMessage />} />
            <Route path="*" element={<Page404 />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};
