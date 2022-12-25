import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
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
): {
  requestFriend: RequestFriend;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    postFunc: requestFriend,
    isLoading,
    isSuccess,
  } = usePostApi<FriendRequestReqBody, FriendRequestResBody>(
    `/users/me/friend-requests`,
    [
      ['/users/me/requestable-users'],
      ['/users/me/friend-requests/outgoing'],
      [`/users/me/friend-relations/${targetId}`],
    ]
  );

  return { requestFriend, isLoading, isSuccess };
};
