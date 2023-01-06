import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { usePostApiWithErrorToast } from '../generics/usePostApi';

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

export const useLogout = (): Omit<
  UseMutationResult<LogoutResBody, unknown, LogoutReqBody, unknown>,
  'mutateAsync'
> & {
  logout: Logout;
} => {
  const { mutateAsync: logout, ...useMutationResult } =
    usePostApiWithErrorToast<LogoutReqBody, LogoutResBody>('/auth/logout');

  return { logout, ...useMutationResult };
};
