import { useContext } from 'react';
import { Presence, SocketContext } from 'providers/SocketProvider';

export const useFriendStatus = (friendId: string): { presence: Presence } => {
  const data = useContext(SocketContext);
  if (data === undefined) {
    throw new Error('GameSocket undefined');
  }
  const { userIdToStatus } = data;

  const onlineUsersMap = new Map(userIdToStatus);
  const presence = onlineUsersMap.has(friendId)
    ? onlineUsersMap.get(friendId) === Presence.INGAME
      ? Presence.INGAME
      : Presence.ONLINE
    : Presence.OFFLINE;

  return { presence };
};
