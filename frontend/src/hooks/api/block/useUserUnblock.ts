import { Block } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
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
  } = useDeleteApi<UnblockUserResBody>(`/users/me/blocks/${targetId}`, [
    ['/users/me/blocks'],
    [`/users/me/block-relations/${targetId}`],
  ]);

  return { unblockUser, isLoading, isSuccess };
};
