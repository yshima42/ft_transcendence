import { useContext, useEffect, useState } from 'react';
import { SocketContext } from 'providers/SocketProvider';

export interface GameOutline {
  roomId: string;
  player1Id: string;
  player2Id: string;
}

export const useGameMonitoring = (): {
  inGameOutlineMap: Map<string, GameOutline>;
} => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, isConnected } = socketContext;
  const [inGameOutlineMap, setInGameOutlineMap] = useState(
    new Map<string, GameOutline>()
  );

  useEffect(() => {
    if (!isConnected) return;

    socket.emit('join_monitor_room', (inGameOutlines: GameOutline[]) => {
      inGameOutlines.forEach((inGameOutline) =>
        inGameOutlineMap.set(inGameOutline.roomId, {
          roomId: inGameOutline.roomId,
          player1Id: inGameOutline.player1Id,
          player2Id: inGameOutline.player2Id,
        })
      );
      setInGameOutlineMap(new Map<string, GameOutline>(inGameOutlineMap));
    });

    socket.on('game_room_created', (createdRoomOutline: GameOutline) => {
      console.log('[Socket Event] game_room_created');
      inGameOutlineMap.set(createdRoomOutline.roomId, {
        roomId: createdRoomOutline.roomId,
        player1Id: createdRoomOutline.player1Id,
        player2Id: createdRoomOutline.player2Id,
      });
      setInGameOutlineMap(new Map<string, GameOutline>(inGameOutlineMap));
    });

    socket.on('game_room_deleted', (deletedRoomId: string) => {
      console.log('[Socket Event] game_room_deleted');
      inGameOutlineMap.delete(deletedRoomId);
      setInGameOutlineMap(new Map<string, GameOutline>(inGameOutlineMap));
    });

    return () => {
      if (!isConnected) return;

      socket.emit('leave_monitor_room');
      socket.off('game_room_created');
      socket.off('game_room_deleted');
    };
  }, [socket, isConnected]);

  return { inGameOutlineMap };
};
