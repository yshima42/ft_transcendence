import { User } from '@prisma/client';
import { QueryKey, UseMutateAsyncFunction } from '@tanstack/react-query';
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
  queryKeys: QueryKey[] = []
): {
  requestFriend: RequestFriend;
  isLoading: boolean;
} => {
  const { postFunc: requestFriend, isLoading } = usePostApi<
    FriendRequestReqBody,
    FriendRequestResBody
  >(`/users/me/friend-requests`, queryKeys);

  return { requestFriend, isLoading };
};
