import { FriendRequest } from '@prisma/client';
import {
  QueryKey,
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
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

export const useFriendRequestCancel = (
  queryKeys: QueryKey[]
): {
  cancelFriendRequest: CancelFriendRequest;
  isLoading: boolean;
} => {
  const axiosDelete = async (userId: string) => {
    const result = await axios.delete<FriendRequestCancelResBody>(
      `/users/me/friend-requests/${userId}`
    );

    return result.data;
  };

  const queryClient = useQueryClient();

  const { mutateAsync: cancelFriendRequest, isLoading } = useMutation(
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

  return { cancelFriendRequest, isLoading };
};
