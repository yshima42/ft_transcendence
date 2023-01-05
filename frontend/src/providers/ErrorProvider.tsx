import { FC, PropsWithChildren, useCallback } from 'react';
import { ToastId } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { UnexpectedError } from 'features/auth/routes/UnexpectedError';

type Props = PropsWithChildren;

export const ErrorProvider: FC<Props> = (props) => {
  const { children } = props;

  const navigate = useNavigate();
  const { customToast } = useCustomToast();
  const id: ToastId = 'unauthorized';

  const onError = useCallback(
    (error: Error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        if (!customToast.isActive(id)) {
          customToast({ id, description: 'Authentication failed.' });
        }
        navigate('/');
      } else {
        customToast({ description: error.message });
      }
    },
    [customToast, navigate]
  );

  return (
    <ErrorBoundary fallback={<UnexpectedError />} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};
