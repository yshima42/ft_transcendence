import { FC, useCallback } from 'react';
import { ToastId } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Page404 } from 'features/auth/routes/Page404';
import { Profile } from './Profile';

export const ProfileRoutes: FC = () => {
  const { id } = useParams();
  const { customToast } = useCustomToast();

  const fallbackRender = useCallback(
    (props: {
      error: Error;
      resetErrorBoundary: (...args: unknown[]) => void;
    }) => {
      const { error, resetErrorBoundary } = props;

      const isInvalidUrlError =
        isAxiosError(error) &&
        error.config?.url === `/users/${id ?? ''}/profile` &&
        (error.response?.status === 400 || error.response?.status === 404);

      if (!isInvalidUrlError) {
        throw error;
      }
      const toastId: ToastId = 'not-exist-url';
      if (!customToast.isActive(toastId)) {
        customToast({ id: toastId, description: 'Not exist the url.' });
      }
      resetErrorBoundary();

      return <Navigate to="/app" />;
    },
    [customToast, id]
  );

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Routes>
        <Route path="" element={<Profile />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </ErrorBoundary>
  );
};
