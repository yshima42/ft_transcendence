import { User } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useBlockUsers = (): { users: User[] } => {
  const { data: users } = useGetApi<User[]>('/users/me/blocks');

  return { users };
};
