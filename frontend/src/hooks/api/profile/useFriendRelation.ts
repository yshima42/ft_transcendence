import { useGetApi } from '../generics/useGetApi';

export type FriendRelation = 'NONE' | 'ACCEPTED' | 'PENDING' | 'RECOGNITION';

export const useFriendRelation = (
  otherId: string
): { friendRelation: FriendRelation } => {
  const { data: friendRelation } = useGetApi<FriendRelation>(
    `/users/me/friend-relation/${otherId}`,
    ['friend-relation', { otherId }]
  );

  return { friendRelation };
};
