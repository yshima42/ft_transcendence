import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export interface ProfileFormData {
  nickname?: string;
  twoFactor?: boolean;
}

export interface ProfileEditResBody {
  user: User;
}

export type EditProfile = UseMutateAsyncFunction<
  ProfileEditResBody,
  unknown,
  ProfileFormData,
  unknown
>;

export const useProfileEdit = (): {
  editProfile: EditProfile;
  isLoading: boolean;
} => {
  const { postFunc: editProfile, isLoading } = usePostApi<
    ProfileFormData,
    ProfileEditResBody
  >(`/users/me/profile`);

  return { editProfile, isLoading };
};
