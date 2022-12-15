import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export interface RequestFriendInProfileReqBody {
  receiverId: string;
}

export interface RequestFriendInProfileResBody {
  user: User;
}

export type RequestFriendInProfile = UseMutateAsyncFunction<
  RequestFriendInProfileResBody,
  unknown,
  RequestFriendInProfileReqBody,
  unknown
>;

export const useProfileFriendRequest = (
  otherId: string
): {
  requestFriendInProfile: RequestFriendInProfile;
  isLoading: boolean;
} => {
  const { postFunc: requestFriendInProfile, isLoading } = usePostApi<
    RequestFriendInProfileReqBody,
    RequestFriendInProfileResBody
  >(`/users/me/friend-requests`, [[`/users/me/friend-relation/${otherId}`]]);

  return { requestFriendInProfile, isLoading };
};
