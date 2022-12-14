import React, { FC, memo, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import socketService from '../utils/socketService';

type Props = {
  gameContextValue: {
    isInRoom: boolean;
    setInRoom: React.Dispatch<React.SetStateAction<boolean>>;
    isLeftSide: boolean;
    setLeftSide: React.Dispatch<React.SetStateAction<boolean>>;
    isGameStarted: boolean;
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
    roomName: string;
    setRoomName: React.Dispatch<React.SetStateAction<string>>;
  };
};

export const JoinRoom: FC<Props> = memo((props) => {
  const [isJoining, setJoining] = useState(false);
  const { user } = useProfile();

  const { setLeftSide, setInRoom, setRoomName } = props.gameContextValue;

  const onClickMatch = () => {
    const socket = socketService.socket;
    if (socket === null) return;

    setJoining(true);
    socket.emit('set_user', user);
    socket.emit('random_match');
    socket.on('go_game_room', (roomId: string, isLeftSide: boolean) => {
      setRoomName(roomId);
      setLeftSide(isLeftSide);
      setInRoom(true);
      setJoining(false);

      socket.emit('join_room', { roomId });
    });
  };

  return (
    <Button onClick={onClickMatch} disabled={isJoining}>
      {isJoining ? 'Matching...' : 'Match'}
    </Button>
  );
});
