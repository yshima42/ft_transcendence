import { Block } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
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
): Omit<
  UseMutationResult<UnblockUserResBody, unknown, void, unknown>,
  'mutateAsync'
> & {
  unblockUser: UnblockUser;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: unblockUser, ...useMutationResult } =
    useDeleteApi<UnblockUserResBody>(`/users/me/blocks/${targetId}`, {
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

  return { unblockUser, ...useMutationResult };
};
