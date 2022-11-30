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

export const useFriendRequest = (): {
  requestFriend: RequestFriend;
  isLoading: boolean;
} => {
  const { postFunc: requestFriend, isLoading } = usePostApi<
    FriendRequestReqBody,
    FriendRequestResBody
  >(`/users/me/friend-requests`);

  return { requestFriend, isLoading };
};
