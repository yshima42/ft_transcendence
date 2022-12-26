import { useContext } from 'react';
import { SocketContext } from 'providers/SocketProvider';

export const useGameRoomId = (
  friendId: string
): { gameRoomId: string | undefined } => {
  const data = useContext(SocketContext);
  if (data === undefined) {
    throw new Error('GameSocket undefined');
  }
  const { userIdToGameRoomIdMap } = data;

  return { gameRoomId: userIdToGameRoomIdMap.get(friendId) };
};
