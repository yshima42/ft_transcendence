import { Block } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export interface BlockUserInProfileReqBody {
  targetId: string;
}

export interface BlockUserInProfileResBody {
  block: Block;
}

export type BlockUserInProfile = UseMutateAsyncFunction<
  BlockUserInProfileResBody,
  unknown,
  BlockUserInProfileReqBody,
  unknown
>;

export const useProfileUserBlock = (
  targetId: string
): {
  blockUserInProfile: BlockUserInProfile;
  isLoading: boolean;
} => {
  const { postFunc: blockUserInProfile, isLoading } = usePostApi<
    BlockUserInProfileReqBody,
    BlockUserInProfileResBody
  >(`/users/me/blocks`, [[`/users/me/blocks/${targetId}`]]);

  return { blockUserInProfile, isLoading };
};
