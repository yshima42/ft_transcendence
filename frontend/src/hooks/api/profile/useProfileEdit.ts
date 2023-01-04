import { useEffect } from 'react';
import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
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
  isSuccess: boolean;
} => {
  const {
    mutateAsync: editProfile,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePostApi<ProfileFormData, ProfileEditResBody>(`/users/me/profile`, [
    ['/users/me/profile'],
    ['/game/matches'],
  ]);

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { editProfile, isLoading, isSuccess };
};
