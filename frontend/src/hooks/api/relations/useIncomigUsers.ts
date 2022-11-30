import { User } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useIncomingUsers = (): { users: User[] } => {
  const { data: users } = useGetApi<User[]>(
    '/users/me/friend-requests/incoming'
  );

  return { users };
};
