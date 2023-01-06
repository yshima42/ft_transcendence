import { FriendRequest } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { useDeleteApi } from '../generics/useDeleteApi';

export interface FriendRequestCancelResBody {
  friendRequest: FriendRequest;
}

export type CancelFriendRequest = UseMutateAsyncFunction<
  FriendRequestCancelResBody,
  unknown,
  void,
  unknown
>;

export const useFriendRequestCancel = (
  targetId: string
): Omit<
  UseMutationResult<FriendRequestCancelResBody, unknown, void, unknown>,
  'mutateAsync'
> & {
  cancelFriendRequest: CancelFriendRequest;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: cancelFriendRequest, ...useMutataionResult } =
    useDeleteApi<FriendRequestCancelResBody>(
      `/users/me/friend-requests/${targetId}`,
      {
        onSuccess: () => {
          const queryKeys = [
            ['/users/me/friend-requests/outgoing'],
            ['/users/me/requestable-users'],
            [`/users/me/friend-relations/${targetId}`],
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
      }
    );

  return { cancelFriendRequest, ...useMutataionResult };
};
