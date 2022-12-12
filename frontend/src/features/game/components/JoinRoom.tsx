import { FC, memo, useContext, useState } from 'react';
import { Button } from '@chakra-ui/react';
import SocketContext from 'contexts/SocketContext';
import gameContext from '../utils/gameContext';
import gameService from '../utils/gameService';

export const JoinRoom: FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isJoining, setJoining] = useState(false);
  const { socket, user } = useContext(SocketContext).SocketState;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setInRoom, isInRoom, setRoomName } = useContext(gameContext);

  const onClickMatch = () => {
    // 何も入力してない時の処理

    setJoining(true);
    socket?.emit('set_user', user);
    socket?.emit('random_match');
    socket?.on('go_game_room', async (roomId: string) => {
      setRoomName(roomId);
      setInRoom(true);
      setJoining(false);

      await gameService
        .joinGameRoom(socket, roomId)
        .catch((e: { error: string }) => {
          alert(e.error);
        });
    });
  };

  return (
    <Button onClick={onClickMatch} disabled={isJoining}>
      {isJoining ? 'Matching...' : 'Match'}
    </Button>
  );
});
