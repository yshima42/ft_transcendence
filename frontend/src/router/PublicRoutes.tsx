import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/providers/useAuthProvider';

export const PublicRoutes: FC = () => {
  const auth = useAuth();

  return auth.user !== '' ? <Navigate to="/user-list" /> : <Outlet />;
};
