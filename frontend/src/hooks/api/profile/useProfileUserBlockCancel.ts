import { Block } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { axios } from 'lib/axios';

export interface UserBlockCancelInProfileResBody {
  block: Block;
}

export type CancelUserBlockInProfile = UseMutateAsyncFunction<
  UserBlockCancelInProfileResBody,
  unknown,
  string,
  unknown
>;

export const useProfileUserBlockCancel = (
  targetId: string
): {
  cancelUserBlockInProfile: CancelUserBlockInProfile;
  isLoading: boolean;
} => {
  const axiosDelete = async (userId: string) => {
    const result = await axios.delete<UserBlockCancelInProfileResBody>(
      `/users/me/blocks/${userId}`
    );

    return result.data;
  };

  const queryClient = useQueryClient();

  const { mutateAsync: cancelUserBlockInProfile, isLoading } = useMutation(
    axiosDelete,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([`/users/me/blocks/${targetId}`]);
      },
    }
  );

  return { cancelUserBlockInProfile, isLoading };
};
