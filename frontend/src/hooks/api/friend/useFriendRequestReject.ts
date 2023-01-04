import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useDeleteApi } from '../generics/useDeleteApi';

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
): {
  rejectFriendRequest: RejectFriendRequest;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: rejectFriendRequest,
    isLoading,
    isSuccess,
  } = useDeleteApi<FriendRequestRejectResBody>(
    `/users/me/friend-requests/incoming/${targetId}`,
    [
      ['/users/me/friend-requests/incoming'],
      ['/users/me/requestable-users'],
      [`/users/me/friend-relations/${targetId}`],
    ]
  );

  return { rejectFriendRequest, isLoading, isSuccess };
};
