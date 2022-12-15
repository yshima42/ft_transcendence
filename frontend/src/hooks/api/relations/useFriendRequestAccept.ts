import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePatchApi } from '../generics/usePatchApi';

export type FriendRequestAcceptReqBody = Partial<FriendRequest>;

export interface FriendRequestAcceptResBody {
  friendRequest: FriendRequest;
}

export type AcceptFriendRequest = UseMutateAsyncFunction<
  FriendRequestAcceptResBody,
  unknown,
  FriendRequestAcceptReqBody,
  unknown
>;

export const useFriendRequestAccept = (): {
  acceptFriendRequest: AcceptFriendRequest;
  isLoading: boolean;
} => {
  const { patchFunc: acceptFriendRequest, isLoading } = usePatchApi<
    FriendRequestAcceptReqBody,
    FriendRequestAcceptResBody
  >(`/users/me/friend-requests/incoming`);

  return { acceptFriendRequest, isLoading };
};
