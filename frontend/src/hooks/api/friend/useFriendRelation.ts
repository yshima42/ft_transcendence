import { useGetApiOmitUndefined } from '../generics/useGetApi';

export type FriendRelation = 'NONE' | 'ACCEPTED' | 'PENDING' | 'RECOGNITION';

export const useFriendRelation = (
  targetId: string
): { friendRelation: FriendRelation } => {
  const {
    data: { friendRelation },
  } = useGetApiOmitUndefined<{ friendRelation: FriendRelation }>(
    `/users/me/friend-relations/${targetId}`
  );

  return { friendRelation };
};

export const useIsFriend = (userId: string): { isFriend: boolean } => {
  const { friendRelation } = useFriendRelation(userId);

  return { isFriend: friendRelation === 'ACCEPTED' };
};
