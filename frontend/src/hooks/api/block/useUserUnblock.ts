import { Block } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { useDeleteApiWithErrorToast } from '../generics/useDeleteApi';

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
): Omit<
  UseMutationResult<UnblockUserResBody, unknown, void, unknown>,
  'mutateAsync'
> & {
  unblockUser: UnblockUser;
} => {
  const { mutateAsync: unblockUser, ...useMutationResult } =
    useDeleteApiWithErrorToast<UnblockUserResBody>(
      `/users/me/blocks/${targetId}`,
      [['/users/me/blocks'], [`/users/me/block-relations/${targetId}`]]
    );

  return { unblockUser, ...useMutationResult };
};
