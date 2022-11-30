import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

// TODO: eslintエラー
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type LogoutReqBody = void;

export interface LogoutResBody {
  message: string;
}

export type Logout = UseMutateAsyncFunction<
  LogoutResBody,
  unknown,
  void,
  unknown
>;

export const useLogout = (): {
  logout: Logout;
  isLoading: boolean;
} => {
  const { postFunc: logout, isLoading } = usePostApi<
    LogoutReqBody,
    LogoutResBody
  >('/auth/login/dummy');

  return { logout, isLoading };
};
