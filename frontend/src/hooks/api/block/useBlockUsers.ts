import { User } from '@prisma/client';
import { useGetApiOmitUndefined } from '../generics/useGetApi';

export const useBlockUsers = (): { users: User[] } => {
  const { data: users } = useGetApiOmitUndefined<User[]>('/users/me/blocks');

  return { users };
};
