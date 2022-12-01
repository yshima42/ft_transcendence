import { User } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useAllUsers = (): { users: User[] } => {
  const { data: users } = useGetApi<User[]>('/users/all');

  return { users };
};
