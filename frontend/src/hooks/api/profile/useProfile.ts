import { User } from '@prisma/client';
import { useGetApiOmitUndefined } from '../generics/useGetApi';

export const useProfile = (userId = 'me'): { user: User } => {
  const { data: user } = useGetApiOmitUndefined<User>(
    `/users/${userId}/profile`
  );

  return { user };
};

export const useIsLoginUser = (userId: string): { isLoginUser: boolean } => {
  const { user } = useProfile();
  const isLoginUser = userId === user.id;

  return { isLoginUser };
};
