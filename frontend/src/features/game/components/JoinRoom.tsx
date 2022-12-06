import { ChangeEvent, FC, FormEvent, memo, useContext, useState } from 'react';
import { Button } from '@chakra-ui/react';
import gameContext from '../utils/gameContext';
import gameService from '../utils/gameService';
import socketService from '../utils/socketService';

export const JoinRoom: FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roomName, setRoomName] = useState('');
  const [isJoining, setJoining] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setInRoom, isInRoom } = useContext(gameContext);

  const handleRoomNameChange = (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setRoomName(value);
  };

  const joinRoom = async (e: FormEvent) => {
    // 何も入力してない時の処理
    e.preventDefault();

    const socket = socketService.socket;
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
    <form onSubmit={joinRoom}>
      <h4>Enter room Id to join</h4>
      <input
        placeholder="Room ID"
        value={roomName}
        onChange={handleRoomNameChange}
      />
      <Button type="submit" disabled={isJoining}>
        {isJoining ? 'Joining...' : 'Join'}
      </Button>
    </form>
  );
});
