import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePatchApi } from '../generics/usePatchApi';

export type AcceptFriendRequestInProfileReqBody = Partial<FriendRequest>;

export interface AcceptFriendRequestInProfileResBody {
  friendRequest: FriendRequest;
}

export type AcceptFriendRequestInProfile = UseMutateAsyncFunction<
  AcceptFriendRequestInProfileResBody,
  unknown,
  AcceptFriendRequestInProfileReqBody,
  unknown
>;

export const useProfileFriendRequestAccept = (
  otherId: string
): {
  acceptFriendRequestInProfile: AcceptFriendRequestInProfile;
  isLoading: boolean;
} => {
  const { patchFunc: acceptFriendRequestInProfile, isLoading } = usePatchApi<
    AcceptFriendRequestInProfileReqBody,
    AcceptFriendRequestInProfileResBody
  >(`/users/me/friend-requests/incoming`, [
    [`/users/me/friend-relation/${otherId}`],
  ]);

  return { acceptFriendRequestInProfile, isLoading };
};
