import { useEffect } from 'react';
import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { useDeleteApi } from '../generics/useDeleteApi';

export interface FriendUnregisterResBody {
  friendRequest: FriendRequest;
}

export type UnregisterFriend = UseMutateAsyncFunction<
  FriendUnregisterResBody,
  unknown,
  void,
  unknown
>;

export const useFriendUnregister = (
  userId: string
): {
  unregisterFriend: UnregisterFriend;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: unregisterFriend,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useDeleteApi<FriendUnregisterResBody>(`/users/me/friends/${userId}`);

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { unregisterFriend, isLoading, isSuccess };
};
