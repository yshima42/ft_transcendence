import { useAuth } from 'hooks/providers/useAuthProvider';
import { useRoutes } from 'react-router-dom';
import { protectedRoutes } from './ProtectedRoutes';
import { publicRoutes } from './PublicRoutes';

export const AppRoutes = (): React.ReactElement | null => {
  const auth = useAuth();

  const routes = auth.user !== '' ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes]);

  return <>{element}</>;
};
