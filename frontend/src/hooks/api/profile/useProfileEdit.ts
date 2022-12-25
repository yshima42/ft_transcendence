import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
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
  isError: boolean;
  isSuccess: boolean;
  failureReason: unknown;
} => {
  const {
    postFunc: editProfile,
    isLoading,
    isError,
    isSuccess,
    failureReason,
  } = usePostApi<ProfileFormData, ProfileEditResBody>(`/users/me/profile`, [
    ['/users/me/profile'],
    ['/game/matches'],
  ]);

  const toast = useToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(failureReason)) {
      toast({
        title: 'Error',
        description: failureReason.response?.data.message,
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isError, toast, failureReason]);

  return { editProfile, isLoading, isError, isSuccess, failureReason };
};
