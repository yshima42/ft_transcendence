import { Block } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
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
  targetId: string
): Omit<
  UseMutationResult<UserBlockResBody, unknown, UserBlockReqBody, unknown>,
  'mutateAsync'
> & {
  blockUser: BlockUser;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: blockUser, ...useMutationResult } = usePostApi<
    UserBlockReqBody,
    UserBlockResBody
  >(`/users/me/blocks`, {
    onSuccess: () => {
      const queryKeys = [
        ['/users/me/blocks'],
        [`/users/me/block-relations/${targetId}`],
      ];
      queryKeys.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: (error) => {
      if (isAxiosError<{ message: string }>(error)) {
        customToast({ description: error.response?.data.message });
      }
    },
  });

  return { blockUser, ...useMutationResult };
};
