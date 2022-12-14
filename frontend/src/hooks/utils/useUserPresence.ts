import { useContext } from 'react';
import { Presence, SocketContext } from 'providers/SocketProvider';

export const useUserPresence = (friendId: string): { presence: Presence } => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('GameSocket undefined');
  }
  const { userIdToPresenceMap } = socketContext;

  // 冗長だけど下のやり方うまく行かなかったので一旦こちらで
  const presence = userIdToPresenceMap.has(friendId)
    ? userIdToPresenceMap.get(friendId) === Presence.INGAME
      ? Presence.INGAME
      : Presence.ONLINE
    : Presence.OFFLINE;

  // こちらのやり方でやりたいが、オンラインになった瞬間に更新が走らないので一旦上記で対応
  // const presence = userIdToPresenceMap.get(friendId) ?? Presence.OFFLINE;

  return { presence };
};
