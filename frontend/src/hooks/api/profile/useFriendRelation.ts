import { FriendRelation } from 'types/friend-relation';
import { useGetApi } from '../generics/useGetApi';

export const useFriendRelation = (
  otherId: string
): { friendRelation: FriendRelation } => {
  const { data: friendRelation } = useGetApi<{
    friendRelation: FriendRelation;
  }>(`/users/me/friend-relation/${otherId}`);

  return friendRelation;
};
