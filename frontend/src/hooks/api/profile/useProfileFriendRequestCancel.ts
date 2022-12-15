import { FriendRequest } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { axios } from 'lib/axios';

export interface CancelFriendRequestInProfileResBody {
  friendRequest: FriendRequest;
}

export type CancelFriendRequestInProfile = UseMutateAsyncFunction<
  CancelFriendRequestInProfileResBody,
  unknown,
  string,
  unknown
>;

export const useProfileFriendRequestCancel = (
  otherId: string
): {
  cancelFriendRequestInProfile: CancelFriendRequestInProfile;
  isLoading: boolean;
} => {
  const axiosDelete = async (userId: string) => {
    const result = await axios.delete<CancelFriendRequestInProfileResBody>(
      '/users/me/friend-requests/' + userId
    );

    return result.data;
  };

  const queryClient = useQueryClient();

  const { mutateAsync: cancelFriendRequestInProfile, isLoading } = useMutation(
    axiosDelete,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([
          `/users/me/friend-relation/${otherId}`,
        ]);
      },
    }
  );

  return { cancelFriendRequestInProfile, isLoading };
};
