import { useEffect } from 'react';
import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
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
    isError,
    error,
  } = useDeleteApi<FriendRequestRejectResBody>(
    `/users/me/friend-requests/incoming/${targetId}`,
    [
      ['/users/me/friend-requests/incoming'],
      ['/users/me/requestable-users'],
      [`/users/me/friend-relations/${targetId}`],
    ]
  );

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { rejectFriendRequest, isLoading, isSuccess };
};
