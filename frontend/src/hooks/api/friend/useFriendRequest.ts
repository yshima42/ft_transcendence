import { User } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { usePostApiWithErrorToast } from '../generics/usePostApi';

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
  const { mutateAsync: requestFriend, ...useMutationResult } =
    usePostApiWithErrorToast<FriendRequestReqBody, FriendRequestResBody>(
      `/users/me/friend-requests`,
      [
        ['/users/me/requestable-users'],
        ['/users/me/friend-requests/outgoing'],
        [`/users/me/friend-relations/${targetId}`],
      ]
    );

  return { requestFriend, ...useMutationResult };
};
