import { useEffect } from 'react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostApi } from '../generics/usePostApi';

export type LogoutReqBody = Record<string, never>;

export interface LogoutResBody {
  message: string;
}

export type Logout = UseMutateAsyncFunction<
  LogoutResBody,
  unknown,
  LogoutReqBody,
  unknown
>;

export const useLogout = (): {
  logout: Logout;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: logout,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePostApi<LogoutReqBody, LogoutResBody>('/auth/logout');

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { logout, isLoading, isSuccess };
};
