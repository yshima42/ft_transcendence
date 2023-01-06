import { FriendRequest } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { useDeleteApiWithErrorToast } from '../generics/useDeleteApi';

export interface FriendRequestRejectResBody {
  friendRequest: FriendRequest;
}

export type RejectFriendRequest = UseMutateAsyncFunction<
  FriendRequestRejectResBody,
  unknown,
  void,
  unknown
>;

export const useFriendRequestReject = (
  targetId: string
): Omit<
  UseMutationResult<FriendRequestRejectResBody, unknown, void, unknown>,
  'mutateAsync'
> & {
  rejectFriendRequest: RejectFriendRequest;
} => {
  const { mutateAsync: rejectFriendRequest, ...useMutationResult } =
    useDeleteApiWithErrorToast<FriendRequestRejectResBody>(
      `/users/me/friend-requests/incoming/${targetId}`,
      [
        ['/users/me/friend-requests/incoming'],
        ['/users/me/requestable-users'],
        [`/users/me/friend-relations/${targetId}`],
      ]
    );

  return { rejectFriendRequest, ...useMutationResult };
};
