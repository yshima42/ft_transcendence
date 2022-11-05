import { Route, Routes } from 'react-router-dom';
import { ChatRoomList } from 'components/pages/ChatRoomList';
import { DirectMessage } from 'components/pages/DirectMessage';
import { Game } from 'components/pages/Game';
import { GameSelect } from 'components/pages/GameSelect';
import { UserList } from 'components/pages/UserList';
import { HeaderLayout } from 'components/templates/HeaderLayout';
import { Login } from '../components/pages/Login';
import { Page404 } from '../components/pages/Page404';

// type AuthContextType = {
//   user: string;
//   signin: (user: string, callback: VoidFunction) => void;
//   signout: (callback: VoidFunction) => void;
// };

// // あまり良くない書き方とのことなので、後ほど検討(参考：https://qiita.com/johnmackay150/items/88654e5064290c24a32a)
// // const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const AuthContext = createContext<AuthContextType>({
//   user: '',
//   signin: (newUser: string, callback: VoidFunction) => {
//     callback();
//   },
//   signout: (callback: VoidFunction) => {
//     callback();
//   },
// });

// const fakeAuthProvider = {
//   isAuthenticated: false,
//   signin(callback: VoidFunction) {
//     fakeAuthProvider.isAuthenticated = true;
//     setTimeout(callback, 100); // fake async
//   },
//   signout(callback: VoidFunction) {
//     fakeAuthProvider.isAuthenticated = false;
//     setTimeout(callback, 100);
//   },
// };

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState('');

//   const signin = (newUser: string, callback: VoidFunction) => {
//     return fakeAuthProvider.signin(() => {
//       setUser(newUser);
//       callback();
//     });
//   };

//   const signout = (callback: VoidFunction) => {
//     return fakeAuthProvider.signout(() => {
//       setUser('');
//       callback();
//     });
//   };

//   const value = { user, signin, signout };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// const useAuth = () => {
//   return useContext(AuthContext);
// };

// const RequireAuth = ({ children }: { children: JSX.Element }) => {
//   const auth = useAuth();
//   const location = useLocation();

//   if (auth.user === '') {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   return children;
// };

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
