import { useContext } from 'react';
import { SocketContext } from 'providers/SocketProvider';

export const useGameRoomId = (
  friendId: string
): { gameRoomId: string | undefined } => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('GameSocket undefined');
  }
  const { userIdToGameRoomIdMap } = socketContext;

  return { gameRoomId: userIdToGameRoomIdMap.get(friendId) };
};
