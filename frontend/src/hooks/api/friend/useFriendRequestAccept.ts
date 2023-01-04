import { useEffect } from 'react';
import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePatchApi } from '../generics/usePatchApi';

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
): {
  acceptFriendRequest: AcceptFriendRequest;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: acceptFriendRequest,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePatchApi<FriendRequestAcceptReqBody, FriendRequestAcceptResBody>(
    `/users/me/friend-requests/incoming`,
    [
      ['/users/me/friend-requests/incoming'],
      ['/users/me/friends'],
      [`/users/me/friend-relations/${targetId}`],
    ]
  );

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { acceptFriendRequest, isLoading, isSuccess };
};
