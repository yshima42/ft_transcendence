import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
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
    deleteFunc: unregisterFriend,
    isLoading,
    isSuccess,
  } = useDeleteApi<FriendUnregisterResBody>(`/users/me/friends/${userId}`);

  return { unregisterFriend, isLoading, isSuccess };
};
