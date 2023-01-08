import { FriendRequest } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { usePatchApiWithErrorToast } from '../generics/usePatchApi';

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
): Omit<
  UseMutationResult<
    FriendRequestAcceptResBody,
    unknown,
    FriendRequestAcceptReqBody,
    unknown
  >,
  'mutateAsync'
> & {
  acceptFriendRequest: AcceptFriendRequest;
} => {
  const { mutateAsync: acceptFriendRequest, ...useMutationResult } =
    usePatchApiWithErrorToast<
      FriendRequestAcceptReqBody,
      FriendRequestAcceptResBody
    >(`/users/me/friend-requests/incoming`, [
      ['/users/me/friend-requests/incoming'],
      ['/users/me/friends'],
      [`/users/me/friend-relations/${targetId}`],
    ]);

  return { acceptFriendRequest, ...useMutationResult };
};
