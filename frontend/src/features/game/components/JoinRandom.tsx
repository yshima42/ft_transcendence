import { FC, memo, useContext, useState } from 'react';
import { Button } from '@chakra-ui/react';
import SocketContext from 'contexts/SocketContext';
import gameContext from '../utils/gameContext';
import gameService from '../utils/gameService';

export const JoinRandom: FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roomName, setRoomName] = useState('');
  const [isJoining, setJoining] = useState(false);
  const { socket, user } = useContext(SocketContext).SocketState;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setInRoom, isInRoom } = useContext(gameContext);

  const onClickMatch = async () => {
    // 何も入力してない時の処理

    socket?.emit('set_user', user);
    socket?.emit('random_match');

    // setRoomName(value);

    if (roomName === '' || roomName.trim() === '' || socket == null) return;

    setJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, roomName)
      .catch((e: { error: string }) => {
        alert(e.error);
      });

    if (joined === true) setInRoom(true);

    setJoining(false);
  };

  return (
    <Button onClick={onClickMatch} disabled={isJoining}>
      {isJoining ? 'Matching...' : 'Match'}
    </Button>
  );
});
