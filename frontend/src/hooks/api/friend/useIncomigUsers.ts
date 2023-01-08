import { User } from '@prisma/client';
import { useGetApiOmitUndefined } from '../generics/useGetApi';

export const useIncomingUsers = (): { users: User[] } => {
  const { data: users } = useGetApiOmitUndefined<User[]>(
    '/users/me/friend-requests/incoming'
  );

  return { users };
};
