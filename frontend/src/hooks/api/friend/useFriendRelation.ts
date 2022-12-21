import { useGetApi } from '../generics/useGetApi';
import { useFriends } from './useFriends';

export type FriendRelation = 'NONE' | 'ACCEPTED' | 'PENDING' | 'RECOGNITION';

export const useFriendRelation = (
  targetId: string
): { friendRelation: FriendRelation } => {
  const {
    data: { friendRelation },
  } = useGetApi<{ friendRelation: FriendRelation }>(
    `/users/me/friend-relations/${targetId}`
  );

  return { friendRelation };
};

export const useIsFriend = (userId: string): { isFriend: boolean } => {
  const { users: friends } = useFriends();
  const isFriend = friends.find((friend) => friend.id === userId) !== undefined;

  return { isFriend };
};
