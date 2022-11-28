// import { useAuth } from 'hooks/useAuthProvider';
import { useRoutes } from 'react-router-dom';
// import { protectedRoutes } from './ProtectedRoutes';
import { publicRoutes } from './PublicRoutes';

export const AppRoutes = (): React.ReactElement | null => {
  // フロントでログイン判定する場合はこちらの方法で処理
  // const auth = useAuth();
  // const routes = auth.user !== '' ? protectedRoutes : publicRoutes;
  const routes = publicRoutes;

  const element = useRoutes([...routes]);

  return <>{element}</>;
};
