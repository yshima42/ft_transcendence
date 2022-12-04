import { FC, FormEvent, memo, useContext, useState } from 'react';
import { Button } from '@chakra-ui/react';
import gameContext from './gameContext';
import gameService from './gameService';
import socketService from './socketService';

export const JoinRoom: FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roomName, setRoomName] = useState('');
  const [isJoining, setJoining] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setInRoom, isInRoom } = useContext(gameContext);

  // const handleRoomNameChange = (e: ChangeEvent) => {
  //   const value = e.target.value;
  //   setRoomName(value);
  // };

  const joinRoom = async (e: FormEvent) => {
    e.preventDefault();
    const socket = socketService.socket;
    if (roomName === '' || roomName.trim() === '' || socket == null) return;

    setJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, roomName)
      .catch((err) => {
        alert(err);
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
        // onChange={handleRoomNameChange}
      />
      <Button type="submit" disabled={isJoining}>
        {isJoining ? 'Joining...' : 'Join'}
      </Button>
    </form>
  );
});
