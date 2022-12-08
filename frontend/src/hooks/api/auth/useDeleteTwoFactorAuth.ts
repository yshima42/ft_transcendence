import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export type DeleteTwoFactorAuthReqBody = Record<string, never>;

export interface DeleteTwoFactorAuthResBody {
  url: string;
}

export type DeleteTwoFactorAuth = UseMutateAsyncFunction<
  DeleteTwoFactorAuthResBody,
  unknown,
  DeleteTwoFactorAuthReqBody,
  unknown
>;

export const useDeleteTwoFactorAuth = (): {
  deleteTwoFactorAuth: DeleteTwoFactorAuth;
  isLoading: boolean;
} => {
  const { postFunc: deleteTwoFactorAuth, isLoading } = usePostApi<
    DeleteTwoFactorAuthReqBody,
    DeleteTwoFactorAuthResBody
  >('/auth/2fa/delete');

  return { deleteTwoFactorAuth, isLoading };
};

// TODO PostからDeleteメソッドに変更
