import { User } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useRequestableUsers = (): { users: User[] } => {
  const { data: users } = useGetApi<User[]>('/users/me/requestable-users');

  return { users };
};
