import { useContext, useEffect, useMemo, useState } from 'react';
import { SocketContext } from 'providers/SocketProvider';

export interface GameOutline {
  roomId: string;
  player1Id: string;
  player2Id: string;
}

export const useGameMonitoring = (): {
  inGameOutlines: GameOutline[];
} => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, connected } = socketContext;
  // roomId の被りを防ぐため Map を使う
  const inGameOutlineMap = useMemo(() => new Map<string, GameOutline>(), []);
  // Games コンポーネントでmap 関数を使うために配列に変換
  const [inGameOutlines, setInGameOutlines] = useState<GameOutline[]>([]);

  useEffect(() => {
    if (!connected) return;

    socket.emit('join_monitor_room', (inGameOutlines: Array<string[3]>) => {
      inGameOutlines.forEach((inGameOutline) =>
        inGameOutlineMap.set(inGameOutline[0], {
          roomId: inGameOutline[0],
          player1Id: inGameOutline[1],
          player2Id: inGameOutline[2],
        })
      );
      setInGameOutlines(Array.from(inGameOutlineMap.values()));
    });

    socket.on('game_room_created', (createdRoomOutline: string[3]) => {
      console.log('[Socket Event] game_room_created');
      inGameOutlineMap.set(createdRoomOutline[0], {
        roomId: createdRoomOutline[0],
        player1Id: createdRoomOutline[1],
        player2Id: createdRoomOutline[2],
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

      socket.emit('leave_monitor_room');
      socket.off('game_room_created');
      socket.off('game_room_deleted');
    };
  }, [socket, connected, inGameOutlineMap]);

  return { inGameOutlines };
};
