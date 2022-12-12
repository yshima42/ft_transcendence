import { memo, FC, useState } from 'react';
import { Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { JoinRoom } from '../components/JoinRoom';
import { PongGame } from '../components/PongGame';
import GameContext, { GameContextProps } from '../utils/gameContext';

export const Game: FC = memo(() => {
  const [isInRoom, setInRoom] = useState(false);
  const [isLeftSide, setLeftSide] = useState(true);
  const [isGameStarted, setGameStarted] = useState(false);
  const [roomName, setRoomName] = useState('');

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
