import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export interface FriendRequestInProfileReqBody {
  receiverId: string;
}

export interface FriendRequestInProfileResBody {
  user: User;
}

export type RequestFriendInProfile = UseMutateAsyncFunction<
  FriendRequestInProfileResBody,
  unknown,
  FriendRequestInProfileReqBody,
  unknown
>;

export const useFriendRequestInProfile = (
  otherId: string
): {
  requestFriendInProfile: RequestFriendInProfile;
  isLoading: boolean;
} => {
  const { postFunc: requestFriendInProfile, isLoading } = usePostApi<
    FriendRequestInProfileReqBody,
    FriendRequestInProfileResBody
  >(`/users/me/friend-requests`, [[`/users/me/friend-relation/${otherId}`]]);

  return { requestFriendInProfile, isLoading };
};
