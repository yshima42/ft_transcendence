import { FriendRequest } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { useDeleteApiWithErrorToast } from '../generics/useDeleteApi';

export interface FriendRequestCancelResBody {
  friendRequest: FriendRequest;
}

export type CancelFriendRequest = UseMutateAsyncFunction<
  FriendRequestCancelResBody,
  unknown,
  void,
  unknown
>;

export const useFriendRequestCancel = (
  targetId: string
): Omit<
  UseMutationResult<FriendRequestCancelResBody, unknown, void, unknown>,
  'mutateAsync'
> & {
  cancelFriendRequest: CancelFriendRequest;
} => {
  const { mutateAsync: cancelFriendRequest, ...useMutataionResult } =
    useDeleteApiWithErrorToast<FriendRequestCancelResBody>(
      `/users/me/friend-requests/${targetId}`,
      [
        ['/users/me/friend-requests/outgoing'],
        ['/users/me/requestable-users'],
        [`/users/me/friend-relations/${targetId}`],
      ]
    );

  return { cancelFriendRequest, ...useMutataionResult };
};
