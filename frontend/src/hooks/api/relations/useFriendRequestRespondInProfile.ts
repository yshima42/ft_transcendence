import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePatchApi } from '../generics/usePatchApi';

export type FriendRequestRespondInProfileReqBody = Partial<FriendRequest>;

export interface FriendRequestRespondInProfileResBody {
  friendRequest: FriendRequest;
}

export type RespondFriendRequestInProfile = UseMutateAsyncFunction<
  FriendRequestRespondInProfileResBody,
  unknown,
  FriendRequestRespondInProfileReqBody,
  unknown
>;

export const useFriendRequestRespondInProfile = (
  otherId: string
): {
  respondFriendRequestInProfile: RespondFriendRequestInProfile;
  isLoading: boolean;
} => {
  const { patchFunc: respondFriendRequestInProfile, isLoading } = usePatchApi<
    FriendRequestRespondInProfileReqBody,
    FriendRequestRespondInProfileResBody
  >(`/users/me/friend-requests/incoming`, [
    [`/users/me/friend-relation/${otherId}`],
  ]);

  return { respondFriendRequestInProfile, isLoading };
};
