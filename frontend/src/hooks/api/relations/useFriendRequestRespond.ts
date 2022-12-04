import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePatchApi } from '../generics/usePatchApi';

export type FriendRequestRespondReqBody = Partial<FriendRequest>;

export interface FriendRequestRespondResBody {
  friendRequest: FriendRequest;
}

export type RespondFriendRequest = UseMutateAsyncFunction<
  FriendRequestRespondResBody,
  unknown,
  FriendRequestRespondReqBody,
  unknown
>;

export const useFriendRequestRespond = (): {
  respondFriendRequest: RespondFriendRequest;
  isLoading: boolean;
} => {
  const { patchFunc: respondFriendRequest, isLoading } = usePatchApi<
    FriendRequestRespondReqBody,
    FriendRequestRespondResBody
  >(`/users/me/friend-requests/incoming`);

  return { respondFriendRequest, isLoading };
};
