import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useDeleteApi } from '../generics/useDeleteApi';

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
): {
  cancelFriendRequest: CancelFriendRequest;
  isLoading: boolean;
} => {
  const { deleteFunc: cancelFriendRequest, isLoading } =
    useDeleteApi<FriendRequestCancelResBody>(
      `/users/me/friend-requests/${targetId}`,
      [
        ['/users/me/friend-requests/outgoing'],
        ['/users/me/requestable-users'],
        [`/users/me/friend-relations/${targetId}`],
      ]
    );

  return { cancelFriendRequest, isLoading };
};
