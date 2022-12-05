import { FriendRequest } from '@prisma/client';
import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { axios } from 'lib/axios';

export interface FriendRequestCancelResBody {
  friendRequest: FriendRequest;
}

export type CancelFriendRequest = UseMutateAsyncFunction<
  FriendRequestCancelResBody,
  unknown,
  string,
  unknown
>;

export const useFriendRequestCancel = (): {
  cancelFriendRequest: CancelFriendRequest;
  isLoading: boolean;
} => {
  const axiosDelete = async (userId: string) => {
    const result = await axios.delete<FriendRequestCancelResBody>(
      '/users/me/friend-requests/' + userId
    );

    return result.data;
  };

  const { mutateAsync: cancelFriendRequest, isLoading } =
    useMutation(axiosDelete);

  return { cancelFriendRequest, isLoading };
};
