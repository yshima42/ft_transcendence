import { FC, memo, useContext, useState } from 'react';
import { Button } from '@chakra-ui/react';
import SocketContext from 'contexts/SocketContext';
import gameContext from '../utils/gameContext';

export const JoinRoom: FC = memo(() => {
  const [isJoining, setJoining] = useState(false);
  const { socket, user } = useContext(SocketContext).SocketState;

  const { setLeftSide, setInRoom, setRoomName } = useContext(gameContext);

  const onClickMatch = () => {
    // 何も入力してない時の処理

    setJoining(true);
    socket?.emit('set_user', user);
    socket?.emit('random_match');
    socket?.on('go_game_room', (roomId: string, isLeftSide: boolean) => {
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
