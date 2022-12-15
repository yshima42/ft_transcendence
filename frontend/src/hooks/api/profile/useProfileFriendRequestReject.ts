import { FriendRequest } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { axios } from 'lib/axios';

export interface RejectFriendRequestInProfileResBody {
  friendRequest: FriendRequest;
}

export type RejectFriendRequestInProfile = UseMutateAsyncFunction<
  RejectFriendRequestInProfileResBody,
  unknown,
  string,
  unknown
>;

export const useProfileFriendRequestReject = (
  otherId: string
): {
  rejectFriendRequestInProfile: RejectFriendRequestInProfile;
  isLoading: boolean;
} => {
  const axiosDelete = async (userId: string) => {
    const result = await axios.delete<RejectFriendRequestInProfileResBody>(
      `/users/me/friend-requests/incoming/${userId}`
    );

    return result.data;
  };

  const queryClient = useQueryClient();

  const { mutateAsync: rejectFriendRequestInProfile, isLoading } = useMutation(
    axiosDelete,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([
          `/users/me/friend-relation/${otherId}`,
        ]);
      },
    }
  );

  return { rejectFriendRequestInProfile, isLoading };
};
