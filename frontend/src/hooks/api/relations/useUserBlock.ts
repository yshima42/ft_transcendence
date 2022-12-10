import { Block } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export interface UserBlockReqBody {
  targetId: string;
}

export interface UserBlockResBody {
  block: Block;
}

export type BlockUser = UseMutateAsyncFunction<
  UserBlockResBody,
  unknown,
  UserBlockReqBody,
  unknown
>;

export const useUserBlock = (): {
  blockUser: BlockUser;
  isLoading: boolean;
} => {
  const { postFunc: blockUser, isLoading } = usePostApi<
    UserBlockReqBody,
    UserBlockResBody
  >(`/users/me/blocks`, [['/users/me/blocks']]);

  return { blockUser, isLoading };
};
