import { FriendRelation } from 'types/friend-relation';
import { useGetApi } from '../generics/useGetApi';

export const useFriendRelation = (otherId: string): FriendRelation => {
  const { data: friendRelation } = useGetApi<FriendRelation>(
    `/users/me/friend-relation/${otherId}`
  );

  return friendRelation;
};
