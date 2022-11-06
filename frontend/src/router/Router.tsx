import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ChatRoomList } from 'components/pages/ChatRoomList';
import { DirectMessage } from 'components/pages/DirectMessage';
import { Game } from 'components/pages/Game';
import { GameSelect } from 'components/pages/GameSelect';
import { UserList } from 'components/pages/UserList';
import { HeaderLayout } from 'components/templates/HeaderLayout';
import { Login } from '../components/pages/Login';
import { LoginPage } from '../components/pages/LoginPage';
import { Page404 } from '../components/pages/Page404';
import { AuthProvider, useAuth } from './providers/useAuthProvider';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.user === '') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const Router = (): React.ReactElement | null => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />}>
          <Route path="/login-page" element={<LoginPage />} />
        </Route>
        {/* mapで処理する */}
        <Route
          path="chatroom-list"
          element={
            <HeaderLayout>
              <RequireAuth>
                <ChatRoomList />
              </RequireAuth>
            </HeaderLayout>
          }
        />
        <Route
          path="user-list"
          element={
            <HeaderLayout>
              <RequireAuth>
                <UserList />
              </RequireAuth>
            </HeaderLayout>
          }
        />
        <Route
          path="game-select"
          element={
            <HeaderLayout>
              <RequireAuth>
                <GameSelect />
              </RequireAuth>
            </HeaderLayout>
          }
        />
        <Route
          path="game"
          element={
            <HeaderLayout>
              <RequireAuth>
                <Game />
              </RequireAuth>
            </HeaderLayout>
          }
        />
        <Route
          path="direct-message"
          element={
            <HeaderLayout>
              <RequireAuth>
                <DirectMessage />
              </RequireAuth>
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
    </AuthProvider>
  );
};
