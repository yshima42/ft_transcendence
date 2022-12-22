import { useContext } from 'react';
import { Presence, SocketContext } from 'providers/SocketProvider';

export const useUserPresence = (friendId: string): { presence: Presence } => {
  const data = useContext(SocketContext);
  if (data === undefined) {
    throw new Error('GameSocket undefined');
  }
  const { userIdToPresence } = data;

  const onlineUsersMap = new Map(userIdToPresence);

  // 冗長だけど他のやり方うまく行かなかったので一旦こちらで
  const presence = onlineUsersMap.has(friendId)
    ? onlineUsersMap.get(friendId) === Presence.INGAME
      ? Presence.INGAME
      : Presence.ONLINE
    : Presence.OFFLINE;

  return { presence };
};
