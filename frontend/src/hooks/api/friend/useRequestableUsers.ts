import { User } from '@prisma/client';
import { useCustomGetApi } from '../generics/useGetApi';

export const useRequestableUsers = (): { users: User[] } => {
  const { data: users } = useCustomGetApi<User[]>(
    '/users/me/requestable-users'
  );

  return { users };
};
