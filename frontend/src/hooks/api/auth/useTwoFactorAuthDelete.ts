import { TwoFactorAuth } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useDeleteApi } from '../generics/useDeleteApi';

export interface DeleteTwoFactorAuthResBody {
  twoFactorAuth: TwoFactorAuth;
}

export type DeleteTwoFactorAuth = UseMutateAsyncFunction<
  DeleteTwoFactorAuthResBody,
  unknown,
  void,
  unknown
>;

export const useTwoFactorAuthDelete = (): {
  deleteTwoFactorAuth: DeleteTwoFactorAuth;
  isLoading: boolean;
} => {
  const { deleteFunc: deleteTwoFactorAuth, isLoading } =
    useDeleteApi<DeleteTwoFactorAuthResBody>(`/auth/2fa`, [
      ['/auth/2fa'],
      ['/auth/2fa/state'],
    ]);

  return { deleteTwoFactorAuth, isLoading };
};
