import { useEffect } from 'react';
import { Block } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { useDeleteApi } from '../generics/useDeleteApi';

export interface UnblockUserResBody {
  block: Block;
}

export type UnblockUser = UseMutateAsyncFunction<
  UnblockUserResBody,
  unknown,
  void,
  unknown
>;

export const useUserUnblock = (
  targetId: string
): {
  unblockUser: UnblockUser;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: unblockUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useDeleteApi<UnblockUserResBody>(`/users/me/blocks/${targetId}`, [
    ['/users/me/blocks'],
    [`/users/me/block-relations/${targetId}`],
  ]);

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { unblockUser, isLoading, isSuccess };
};
