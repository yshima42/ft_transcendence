import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { axios } from 'lib/axios';

export interface FriendRequestRejectResBody {
  friendRequest: FriendRequest;
}

export type RejectFriendRequest = UseMutateAsyncFunction<
  FriendRequestRejectResBody,
  unknown,
  string,
  unknown
>;

export const useFriendRequestReject = (): {
  rejectFriendRequest: RejectFriendRequest;
  isLoading: boolean;
} => {
  const axiosDelete = async (userId: string) => {
    const result = await axios.delete<FriendRequestRejectResBody>(
      '/users/me/friend-requests/incoming/' + userId
    );

    return result.data;
  };

  const { mutateAsync: rejectFriendRequest, isLoading } =
    useMutation(axiosDelete);

  return { rejectFriendRequest, isLoading };
};
