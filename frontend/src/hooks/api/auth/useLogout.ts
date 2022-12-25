import { UseMutateAsyncFunction } from '@tanstack/react-query';
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
    postFunc: logout,
    isLoading,
    isSuccess,
  } = usePostApi<LogoutReqBody, LogoutResBody>('/auth/logout');

  return { logout, isLoading, isSuccess };
};
