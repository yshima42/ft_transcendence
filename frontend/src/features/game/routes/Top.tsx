import { memo, FC, useState, useEffect } from 'react';
import { Center } from '@chakra-ui/react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { JoinRoom } from '../components/JoinRoom';
import { PongGame } from '../components/PongGame';
import socketService from '../utils/socketService';

export const Top: FC = memo(() => {
  const [isInRoom, setInRoom] = useState(false);
  const [isLeftSide, setLeftSide] = useState(true);
  const [isGameStarted, setGameStarted] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // TODO: Propsで渡してcontext使わなくても良い
  const gameContextValue = {
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
  };

  const connectSocket = async () => {
    await socketService.connect('http://localhost:3000/game').catch((err) => {
      console.log('Error: ', err);
    });
  };

  useEffect(() => {
    void connectSocket();
  }, []);

  return (
    <ContentLayout title="">
      <Center>
        {!isInRoom && <JoinRoom gameContextValue={gameContextValue} />}
        {isInRoom && <PongGame gameContextValue={gameContextValue} />}
      </Center>
    </ContentLayout>
  );
});
