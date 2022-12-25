import { useContext, useEffect, useState } from 'react';
import { SocketContext } from 'providers/SocketProvider';

export interface GameOutline {
  roomId: string;
  leftPlayerId: string;
  rightPlayerId: string;
}

export const useGameMonitoring = (): {
  inGameOutlines: GameOutline[];
} => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, connected } = socketContext;
  const inGameOutlineMap = new Map<string, GameOutline>();
  const [inGameOutlines, setInGameOutlines] = useState<GameOutline[]>([]);

  useEffect(() => {
    if (!connected) return;

    socket.emit(
      'join_game_monitor_room',
      (inGameOutlines: Array<string[3]>) => {
        console.log('[Socket Event] join_game_monitor_room');
        inGameOutlines.forEach((inGameOutline) =>
          inGameOutlineMap.set(inGameOutline[0], {
            roomId: inGameOutline[0],
            leftPlayerId: inGameOutline[1],
            rightPlayerId: inGameOutline[2],
          })
        );
        setInGameOutlines(Array.from(inGameOutlineMap.values()));
      }
    );

    socket.on('game_room_created', (createdRoomOutline: string[3]) => {
      console.log('[Socket Event] game_room_created');
      inGameOutlineMap.set(createdRoomOutline[0], {
        roomId: createdRoomOutline[0],
        leftPlayerId: createdRoomOutline[1],
        rightPlayerId: createdRoomOutline[2],
      });
      setInGameOutlines(Array.from(inGameOutlineMap.values()));
    });

    socket.on('game_room_deleted', (deletedRoomId: string) => {
      console.log('[Socket Event] game_room_deleted');
      inGameOutlineMap.delete(deletedRoomId);
      setInGameOutlines(Array.from(inGameOutlineMap.values()));
    });

    return () => {
      if (!connected) return;

      socket.emit('leave_game_monitor_room');
      socket.off('game_room_created');
      socket.off('game_room_deleted');
    };
  }, [socket, connected]);

  return { inGameOutlines };
};
