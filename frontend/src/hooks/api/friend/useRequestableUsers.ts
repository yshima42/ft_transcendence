import { User } from '@prisma/client';
import { useGetApiOmitUndefined } from '../generics/useGetApi';

export const useRequestableUsers = (): { users: User[] } => {
  const { data: users } = useGetApiOmitUndefined<User[]>(
    '/users/me/requestable-users'
  );

  return { users };
};
