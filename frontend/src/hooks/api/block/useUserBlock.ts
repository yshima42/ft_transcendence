import { Block } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { usePostApiWithErrorToast } from '../generics/usePostApi';

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
  targetId: string
): Omit<
  UseMutationResult<UserBlockResBody, unknown, UserBlockReqBody, unknown>,
  'mutateAsync'
> & {
  blockUser: BlockUser;
} => {
  const { mutateAsync: blockUser, ...useMutationResult } =
    usePostApiWithErrorToast<UserBlockReqBody, UserBlockResBody>(
      `/users/me/blocks`,
      [
        ['/users/me/blocks'],
        [`/users/me/block-relations/${targetId}`],
        [`/dm/rooms`],
      ]
    );

  return { blockUser, ...useMutationResult };
};
