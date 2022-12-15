import { useFriends } from 'hooks/api';

export const useIsFrind = (userId: string): { isFriend: boolean } => {
  const { users: friends } = useFriends();
  const isFriend = friends.find((friend) => friend.id === userId) !== undefined;

  return { isFriend };
};
