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

    socket.emit('join_monitor_room', (inGameOutlines: Array<string[3]>) => {
      inGameOutlines.forEach((inGameOutline) =>
        inGameOutlineMap.set(inGameOutline[0], {
          roomId: inGameOutline[0],
          player1Id: inGameOutline[1],
          player2Id: inGameOutline[2],
        })
      );
      setInGameOutlineMap(new Map<string, GameOutline>(inGameOutlineMap));
    });

    socket.on('game_room_created', (createdRoomOutline: string[3]) => {
      console.log('[Socket Event] game_room_created');
      inGameOutlineMap.set(createdRoomOutline[0], {
        roomId: createdRoomOutline[0],
        player1Id: createdRoomOutline[1],
        player2Id: createdRoomOutline[2],
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
