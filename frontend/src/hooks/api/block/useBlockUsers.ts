import { User } from '@prisma/client';
import { useCustomGetApi } from '../generics/useGetApi';

export const useBlockUsers = (): { users: User[] } => {
  const { data: users } = useCustomGetApi<User[]>('/users/me/blocks');

  return { users };
};
