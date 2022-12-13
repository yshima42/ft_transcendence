import { FriendRequest } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  useMutation,
  // useQueryClient,
} from '@tanstack/react-query';
import { axios } from 'lib/axios';

export interface FriendRequestCancelInProfileResBody {
  friendRequest: FriendRequest;
}

export type CancelFriendRequestInProfile = UseMutateAsyncFunction<
  FriendRequestCancelInProfileResBody,
  unknown,
  string,
  unknown
>;

export const useFriendRequestCancelInProfile = (): // otherId: string
{
  cancelFriendRequestInProfile: CancelFriendRequestInProfile;
  isLoading: boolean;
} => {
  const axiosDelete = async (userId: string) => {
    const result = await axios.delete<FriendRequestCancelInProfileResBody>(
      '/users/me/friend-requests/' + userId
    );

    return result.data;
  };

  // const queryClient = useQueryClient();

  const { mutateAsync: cancelFriendRequestInProfile, isLoading } =
    useMutation(axiosDelete);
  // useMutation(axiosDelete, {
  //   onSuccess: () => {
  //     void queryClient.invalidateQueries({[[`/users/me/friend-relation/${otherId}`]]});
  //   }
  // });

  return { cancelFriendRequestInProfile, isLoading };
};
