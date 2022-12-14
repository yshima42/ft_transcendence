import React, { FC, memo, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { Room } from '../hooks/useGame';
import { Matching } from '../routes/Matching';
import socketService from '../utils/socketService';

type Props = {
  setRoom: React.Dispatch<React.SetStateAction<Room>>;
};

export const JoinRoom: FC<Props> = memo((props) => {
  const [isJoining, setJoining] = useState(false);
  const { user } = useProfile();

  const { setRoom } = props;

  const onClickMatch = () => {
    const socket = socketService.socket;
    if (socket === null) return;

    setJoining(true);
    socket.emit('set_user', user);
    socket.emit('random_match');
    socket.on('go_game_room', (roomId: string, isLeftSide: boolean) => {
      setRoom({ roomId: roomId, isLeftSide });
      setJoining(false);

      socket.emit('join_room', { roomId });
    });
  };

  return (
    <>
      {isJoining ? (
        <Matching />
      ) : (
        <Button onClick={onClickMatch} disabled={isJoining}>
          Match
        </Button>
      )}
    </>
  );
});
