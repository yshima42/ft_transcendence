import { OneTimePasswordAuth } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useDeleteApi } from '../generics/useDeleteApi';

export interface DeleteOtpAuthResBody {
  oneTimePassword: OneTimePasswordAuth;
}

export type DeleteOtpAuth = UseMutateAsyncFunction<
  DeleteOtpAuthResBody,
  unknown,
  void,
  unknown
>;

export const useOtpAuthDelete = (): {
  deleteOtpAuth: DeleteOtpAuth;
  isLoading: boolean;
} => {
  const { deleteFunc: deleteOtpAuth, isLoading } =
    useDeleteApi<DeleteOtpAuthResBody>(`/auth/otp`, [
      ['/auth/otp/qrcode-url'],
      ['/auth/otp'],
    ]);

  return { deleteOtpAuth, isLoading };
};
