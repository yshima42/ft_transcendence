import { User } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useFriends = (): { users: User[] } => {
  const { data: users } = useGetApi<User[]>('/users/me/friends');

  return { users };
};

export const useIsFriend = (userId: string): { isFriend: boolean } => {
  const { users: friends } = useFriends();
  const isFriend = friends.find((friend) => friend.id === userId) !== undefined;

  return { isFriend };
};
