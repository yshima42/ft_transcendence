import { User } from '@prisma/client';
import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export interface ProfileFormData {
  nickname?: string;
  twoFactor?: boolean;
}

const postProfile = async (profileFormData: ProfileFormData) => {
  const result = await axios.post<User>('/profile', profileFormData);

  return result.data;
};

export const useSaveProfile = (): {
  saveProfile: UseMutateAsyncFunction<User, unknown, ProfileFormData, unknown>;
  isLoading: boolean;
} => {
  const { mutateAsync: saveProfile, isLoading } = useMutation(postProfile);

  return { saveProfile, isLoading };
};
