import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
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

export const useLogout = (): Omit<
  UseMutationResult<LogoutResBody, unknown, LogoutReqBody, unknown>,
  'mutateAsync'
> & {
  logout: Logout;
} => {
  const { customToast } = useCustomToast();

  const { mutateAsync: logout, ...useMutationResult } = usePostApi<
    LogoutReqBody,
    LogoutResBody
  >('/auth/logout', {
    onError: (error) => {
      if (isAxiosError<{ message: string }>(error)) {
        customToast({ description: error.response?.data.message });
      }
    },
  });

  return { logout, ...useMutationResult };
};
