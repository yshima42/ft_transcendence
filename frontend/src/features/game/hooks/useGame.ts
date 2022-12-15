import { useEffect, useState } from 'react';
import { useProfile } from 'hooks/api';
import { io, Socket } from 'socket.io-client';

export enum GamePhase {
  Top = 0,
  Matching = 1,
  // Confim = 2,
  WaitStart = 3,
  InGame = 4,
  Result = 5,
}

// ここでuseRefを使ってsocketのconnect処理ができたら理想
export const useGame = (): {
  gamePhase: GamePhase;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  socket: Socket;
  roomId: string;
  isLeftSide: boolean;
} => {
  const [gamePhase, setGamePhase] = useState(GamePhase.Top);
  const [roomId, setRoomId] = useState('');
  const [isLeftSide, setIsLeftSide] = useState(true);

  // TODO: socket はとりあえずの仮実装
  const [socket] = useState(io('http://localhost:3000/game'));
  const { user } = useProfile();

  useEffect(() => {
    socket.on('go_game_room', (roomId: string, isLeftSide: boolean) => {
      setRoomId(roomId);
      setIsLeftSide(isLeftSide);
      setGamePhase(GamePhase.WaitStart);
      socket.emit('join_room', { roomId });
      socket.emit('connect_pong', { roomId });
    });
    socket.on('start_game', () => {
      setGamePhase(GamePhase.InGame);
    });
    socket.on('done_game', () => {
      setGamePhase(GamePhase.Result);
    });

    return () => {
      socket.off('go_game_room');
      socket.off('start_game');
      socket.off('done_game');
    };
  }, [socket]);

  useEffect(() => {
    switch (gamePhase) {
      case GamePhase.Matching: {
        socket.emit('set_user', user);
        socket.emit('random_match');
        break;
      }
    }
  }, [gamePhase, user, socket]);

  return { gamePhase, setGamePhase, socket, roomId, isLeftSide };
};
