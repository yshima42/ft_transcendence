import { FC, PropsWithChildren, useCallback } from 'react';
import { ToastId } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, useMatch, useParams } from 'react-router-dom';
import { UnexpectedError } from 'features/auth/routes/UnexpectedError';

type Props = PropsWithChildren;

export const ErrorProvider: FC<Props> = (props) => {
  const { children } = props;

  const { customToast } = useCustomToast();
  const { id } = useParams();
  const isProfilePage = Boolean(useMatch('/app/users/:id'));

  const fallbackRender = useCallback(
    (props: {
      error: Error;
      resetErrorBoundary: (...args: unknown[]) => void;
    }) => {
      const { error, resetErrorBoundary } = props;

      if (isAxiosError(error) && error.response?.status === 401) {
        const id: ToastId = 'unauthorized';
        if (!customToast.isActive(id)) {
          customToast({ id, description: 'Authentication failed.' });
        }
        resetErrorBoundary();

        return <Navigate to="/" />;
      } else if (
        isProfilePage &&
        isAxiosError(error) &&
        error.config?.url === `/users/${id ?? ''}/profile` &&
        (error.response?.status === 400 || error.response?.status === 404)
      ) {
        const id: ToastId = 'not-exist-url';
        if (!customToast.isActive(id)) {
          customToast({ id, description: 'Not exist the url.' });
        }
        resetErrorBoundary();

        return <Navigate to="/app/users" />;
      } else {
        customToast({ description: error.message });

        return <UnexpectedError />;
      }
    },
    [customToast, isProfilePage, id]
  );

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>
  );
};
