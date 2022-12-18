import { FriendRequest } from '@prisma/client';
import {
  QueryKey,
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
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

export const useFriendRequestReject = (
  queryKeys: QueryKey[]
): {
  rejectFriendRequest: RejectFriendRequest;
  isLoading: boolean;
} => {
  const axiosDelete = async (userId: string) => {
    const result = await axios.delete<FriendRequestRejectResBody>(
      `/users/me/friend-requests/incoming/${userId}`
    );

    return result.data;
  };

  const queryClient = useQueryClient();

  const { mutateAsync: rejectFriendRequest, isLoading } = useMutation(
    axiosDelete,
    {
      onSuccess: () => {
        if (queryKeys !== undefined) {
          queryKeys.forEach((queryKey) => {
            void queryClient.invalidateQueries({ queryKey });
          });
        }
      },
    }
  );

  return { rejectFriendRequest, isLoading };
};
