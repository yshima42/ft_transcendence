import { useEffect } from 'react';
import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostApi } from '../generics/usePostApi';

export interface FriendRequestReqBody {
  receiverId: string;
}

export interface FriendRequestResBody {
  user: User;
}

export type RequestFriend = UseMutateAsyncFunction<
  FriendRequestResBody,
  unknown,
  FriendRequestReqBody,
  unknown
>;

export const useFriendRequest = (
  targetId: string
): {
  requestFriend: RequestFriend;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: requestFriend,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePostApi<FriendRequestReqBody, FriendRequestResBody>(
    `/users/me/friend-requests`,
    [
      ['/users/me/requestable-users'],
      ['/users/me/friend-requests/outgoing'],
      [`/users/me/friend-relations/${targetId}`],
    ]
  );

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { requestFriend, isLoading, isSuccess };
};
