import { memo, FC, useState, useEffect } from 'react';
import { Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { JoinRoom } from '../components/JoinRoom';
import { PongGame } from '../components/PongGame';
import GameContext, { GameContextProps } from '../utils/gameContext';
import socketService from '../utils/socketService';

export const Game: FC = memo(() => {
  const [isInRoom, setInRoom] = useState(false);
  const [isLeftSide, setLeftSide] = useState(true);
  const [isGameStarted, setGameStarted] = useState(false);
  const [roomName, setRoomName] = useState('');

  // TODO: Propsで渡してcontext使わなくても良い
  const gameContextValue: GameContextProps = {
    isInRoom,
    setInRoom,
    isLeftSide,
    setLeftSide,
    isGameStarted,
    setGameStarted,
    roomName,
    setRoomName,
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
    <GameContext.Provider value={gameContextValue}>
      <ContentLayout>
        <Center>
          {!isInRoom && <JoinRoom />}
          {isInRoom && <PongGame />}
        </Center>
        <Center>
          <Link to="/app">
            <Button>Back</Button>
          </Link>
        </Center>
      </ContentLayout>
    </GameContext.Provider>
  );
});
