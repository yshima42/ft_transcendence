import { Block } from '@prisma/client';
import { QueryKey, UseMutateAsyncFunction } from '@tanstack/react-query';
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

export const useUserBlock = (
  queryKeys: QueryKey[]
): {
  blockUser: BlockUser;
  isLoading: boolean;
} => {
  const { postFunc: blockUser, isLoading } = usePostApi<
    UserBlockReqBody,
    UserBlockResBody
  >(`/users/me/blocks`, queryKeys);

  return { blockUser, isLoading };
};
