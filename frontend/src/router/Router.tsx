import { createContext, FC, memo, useContext, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ChatRoomList } from 'components/pages/ChatRoomList';
import { DirectMessage } from 'components/pages/DirectMessage';
import { Game } from 'components/pages/Game';
import { GameSelect } from 'components/pages/GameSelect';
import { UserList } from 'components/pages/UserList';
import { HeaderLayout } from 'components/templates/HeaderLayout';
import { Login } from '../components/pages/Login';
import { Page404 } from '../components/pages/Page404';

type AuthContextType = {
  user: string;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
};

// あまり良くない書き方とのことなので、後ほど検討(参考：https://qiita.com/johnmackay150/items/88654e5064290c24a32a)
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType>({
  user: '',
  signin: (newUser: string, callback: VoidFunction) => {
    callback();
  },
  signout: (callback: VoidFunction) => {
    callback();
  },
});

const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState('');

  const signin = (newUser: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  const signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser('');
      callback();
    });
  };

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthStatus: FC = memo(() => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.user === '') {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Hello {auth.user}!{' '}
      <button
        onClick={() => {
          auth.signout(() => navigate('/'));
        }}
      >
        Sign out
      </button>
    </p>
  );
});

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.user === '') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const to = '/user-list';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;

    auth.signin(username, () => {
      navigate(to as string, { replace: true });
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name="username" type="text" />
        </label>{' '}
        <button type="submit">Login</button>
      </form>
    </div>
  );
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
