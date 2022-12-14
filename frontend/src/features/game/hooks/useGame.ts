import { useState } from 'react';

type GameState = {
  isInRoom: boolean;
  setInRoom: React.Dispatch<React.SetStateAction<boolean>>;
  isLeftSide: boolean;
  setLeftSide: React.Dispatch<React.SetStateAction<boolean>>;
  isGameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  isConfirmed: boolean;
  setIsConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  isJoining: boolean;
  setJoining: React.Dispatch<React.SetStateAction<boolean>>;
};

// ここでuseRefを使ってsocketのconnect処理ができたら理想
export const useGame = (): {
  gameState: GameState;
} => {
  const [isInRoom, setInRoom] = useState(false);
  const [isLeftSide, setLeftSide] = useState(true);
  const [isGameStarted, setGameStarted] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isJoining, setJoining] = useState(false);

  const data = {
    isInRoom,
    setInRoom,
    isLeftSide,
    setLeftSide,
    isGameStarted,
    setGameStarted,
    roomName,
    setRoomName,
    isConfirmed,
    setIsConfirmed,
    isJoining,
    setJoining,
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
