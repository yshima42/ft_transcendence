import { FriendRequest } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { useDeleteApi } from '../generics/useDeleteApi';

export interface FriendRequestRejectResBody {
  friendRequest: FriendRequest;
}

export type RejectFriendRequest = UseMutateAsyncFunction<
  FriendRequestRejectResBody,
  unknown,
  void,
  unknown
>;

export const useFriendRequestReject = (
  targetId: string
): Omit<
  UseMutationResult<FriendRequestRejectResBody, unknown, void, unknown>,
  'mutateAsync'
> & {
  rejectFriendRequest: RejectFriendRequest;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: rejectFriendRequest, ...useMutationResult } =
    useDeleteApi<FriendRequestRejectResBody>(
      `/users/me/friend-requests/incoming/${targetId}`,
      {
        onSuccess: () => {
          const queryKeys = [
            ['/users/me/friend-requests/incoming'],
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

  return { rejectFriendRequest, ...useMutationResult };
};
