import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useDeleteApi } from '../generics/useDeleteApi';

export interface FriendUnregisterInProfileResBody {
  friendRequest: FriendRequest;
}

export type UnregisterFriendInProfile = UseMutateAsyncFunction<
  FriendUnregisterInProfileResBody,
  unknown,
  void,
  unknown
>;

export const useFriendUnregisterInProfile = (
  userId: string
): {
  unregisterFriendInProfile: UnregisterFriendInProfile;
  isLoading: boolean;
} => {
  const { deleteFunc: unregisterFriendInProfile, isLoading } =
    useDeleteApi<FriendUnregisterInProfileResBody>(
      `/users/me/friends/${userId}`,
      [[`/users/me/friend-relation/${userId}`]]
    );

  return { unregisterFriendInProfile, isLoading };
};
