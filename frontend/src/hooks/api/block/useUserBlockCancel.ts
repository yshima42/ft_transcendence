import { Block } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useDeleteApi } from '../generics/useDeleteApi';

export interface UserBlockCancelResBody {
  block: Block;
}

export type CancelUserBlock = UseMutateAsyncFunction<
  UserBlockCancelResBody,
  unknown,
  void,
  unknown
>;

export const useUserBlockCancel = (
  targetId: string
): {
  cancelUserBlock: CancelUserBlock;
  isLoading: boolean;
} => {
  const { deleteFunc: cancelUserBlock, isLoading } =
    useDeleteApi<UserBlockCancelResBody>(`/users/me/blocks/${targetId}`, [
      ['/users/me/blocks'],
      [`/users/me/block-relations/${targetId}`],
    ]);

  return { cancelUserBlock, isLoading };
};
