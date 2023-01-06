import { User } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostApi } from '../generics/usePostApi';

export interface FriendRequestReqBody {
  receiverId: string;
}

export interface FriendRequestResBody {
  user: User;
}

export type RequestFriend = UseMutateAsyncFunction<
  FriendRequestResBody,
  unknown,
  FriendRequestReqBody,
  unknown
>;

export const useFriendRequest = (
  targetId: string
): Omit<
  UseMutationResult<
    FriendRequestResBody,
    unknown,
    FriendRequestReqBody,
    unknown
  >,
  'mutateAsync'
> & {
  requestFriend: RequestFriend;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: requestFriend, ...useMutationResult } = usePostApi<
    FriendRequestReqBody,
    FriendRequestResBody
  >(`/users/me/friend-requests`, {
    onSuccess: () => {
      const queryKeys = [
        ['/users/me/requestable-users'],
        ['/users/me/friend-requests/outgoing'],
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
  });

  return { requestFriend, ...useMutationResult };
};
