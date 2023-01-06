import { User } from '@prisma/client';
import { useCustomGetApi } from '../generics/useGetApi';

export const useProfile = (userId = 'me'): { user: User } => {
  const { data: user } = useCustomGetApi<User>(`/users/${userId}/profile`);

  return { user };
};

export const useIsLoginUser = (userId: string): { isLoginUser: boolean } => {
  const { user } = useProfile();
  const isLoginUser = userId === user.id;

  return { isLoginUser };
};
