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
  userId: string
): {
  cancelFriendRequest: CancelFriendRequest;
  isLoading: boolean;
} => {
  const { deleteFunc: cancelFriendRequest, isLoading } =
    useDeleteApi<FriendRequestCancelResBody>(
      `/users/me/friend-requests/${userId}`
    );

  return { cancelFriendRequest, isLoading };
};
