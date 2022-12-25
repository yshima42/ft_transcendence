import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePatchApi } from '../generics/usePatchApi';

export interface FriendRequestAcceptReqBody {
  creatorId: string;
}

export interface FriendRequestAcceptResBody {
  friendRequest: FriendRequest;
}

export type AcceptFriendRequest = UseMutateAsyncFunction<
  FriendRequestAcceptResBody,
  unknown,
  FriendRequestAcceptReqBody,
  unknown
>;

export const useFriendRequestAccept = (
  targetId: string
): {
  acceptFriendRequest: AcceptFriendRequest;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    patchFunc: acceptFriendRequest,
    isLoading,
    isSuccess,
  } = usePatchApi<FriendRequestAcceptReqBody, FriendRequestAcceptResBody>(
    `/users/me/friend-requests/incoming`,
    [
      ['/users/me/friend-requests/incoming'],
      ['/users/me/friends'],
      [`/users/me/friend-relations/${targetId}`],
    ]
  );

  return { acceptFriendRequest, isLoading, isSuccess };
};
