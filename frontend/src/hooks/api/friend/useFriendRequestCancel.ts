import { useEffect } from 'react';
import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
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
  isSuccess: boolean;
} => {
  const {
    mutateAsync: cancelFriendRequest,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useDeleteApi<FriendRequestCancelResBody>(
    `/users/me/friend-requests/${targetId}`,
    [
      ['/users/me/friend-requests/outgoing'],
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

  return { cancelFriendRequest, isLoading, isSuccess };
};
