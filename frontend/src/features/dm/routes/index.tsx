import { FC, useCallback } from 'react';
import { ToastId } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Page404 } from 'features/auth/routes/Page404';
import { DmRoomPage } from './DmRoomPage';
import { DmRoomsPage } from './DmRoomsPage';

export const DmRoutes: FC = () => {
  const { customToast } = useCustomToast();

  const fallbackRender = useCallback(
    (props: {
      error: Error;
      resetErrorBoundary: (...args: unknown[]) => void;
    }) => {
      const { error, resetErrorBoundary } = props;
      const isInvalidUrlError =
        isAxiosError(error) &&
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
    [customToast]
  );

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Routes>
        <Route path="rooms" element={<DmRoomsPage />} />
        <Route path="rooms/:dmRoomId" element={<DmRoomPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </ErrorBoundary>
  );
};
