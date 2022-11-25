import { User } from '@prisma/client';
import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export interface AvatarFormData {
  file?: File;
}

const postAvatar = async (avatarFormData: AvatarFormData) => {
  const result = await axios.post<User>('/profile/avatar', avatarFormData);

  return result.data;
};

export const useSaveAvatar = (): {
  saveAvatar: UseMutateAsyncFunction<User, unknown, AvatarFormData, unknown>;
  isLoading: boolean;
} => {
  const { mutateAsync: saveAvatar, isLoading } = useMutation(postAvatar);

  return { saveAvatar, isLoading };
};
