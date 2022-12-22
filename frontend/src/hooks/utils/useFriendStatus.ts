import { useContext } from 'react';
import { SocketContext } from 'providers/SocketProvider';

export enum Status {
  Offline = 0,
  Online = 1,
  InGame = 2,
}

export const useFriendStatus = (friendId: string): { status: Status } => {
  const data = useContext(SocketContext);
  if (data === undefined) {
    throw new Error('GameSocket undefined');
  }
  const { userIdToStatus } = data;

  const onlineUsersMap = new Map(userIdToStatus);
  const status = onlineUsersMap.has(friendId)
    ? onlineUsersMap.get(friendId) === 'INGAME'
      ? Status.InGame
      : Status.Online
    : Status.Offline;

  return { status };
};
