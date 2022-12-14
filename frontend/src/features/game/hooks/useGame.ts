import { useState } from 'react';

export interface Room {
  roomId: string;
  isLeftSide: boolean;
}

type GameState = {
  room: Room;
  setRoom: React.Dispatch<React.SetStateAction<Room>>;
  isGameStarted: boolean;
  setIsGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  isConfirmed: boolean;
  setIsConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
};

// ここでuseRefを使ってsocketのconnect処理ができたら理想
export const useGame = (): {
  gameState: GameState;
} => {
  const [room, setRoom] = useState({ roomId: '', isLeftSide: true });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const data = {
    room,
    setRoom,
    isGameStarted,
    setIsGameStarted,
    isConfirmed,
    setIsConfirmed,
  };

  // const onClickMatch = () => {
  //   const socket = socketService.socket;
  //   if (socket === null) return;

  //   setJoining(true);
  //   socket.emit('set_user', user);
  //   socket.emit('random_match');
  //   socket.on('go_game_room', (roomId: string, isLeftSide: boolean) => {
  //     setRoomName(roomId);
  //     setLeftSide(isLeftSide);
  //     setInRoom(true);
  //     setJoining(false);

  //     socket.emit('join_room', { roomId });
  //   });
  // };

  return { gameState: data };
};
