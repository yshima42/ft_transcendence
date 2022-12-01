import { User } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useProfile = (userId = 'me'): { user: User } => {
  const { data: user } = useGetApi<User>(`/users/${userId}/profile`);

  return { user };
};
