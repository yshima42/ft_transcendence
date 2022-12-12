import { memo, FC, useContext, useState } from 'react';
import { Box, Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import SocketContext from 'contexts/SocketContext';
import { JoinRoom } from '../components/JoinRoom';
import { PongGame } from '../components/PongGame';
import GameContext, { GameContextProps } from '../utils/gameContext';

export const GameTop: FC = memo(() => {
  const [isInRoom, setInRoom] = useState(false);
  const [isLeftSide, setLeftSide] = useState(true);
  const [isGameStarted, setGameStarted] = useState(false);

  const gameContextValue: GameContextProps = {
    isInRoom,
    setInRoom,
    isLeftSide,
    setLeftSide,
    isGameStarted,
    setGameStarted,
  };

  const { socket, uid, users } = useContext(SocketContext).SocketState;

  return (
    <GameContext.Provider value={gameContextValue}>
      <ContentLayout title="">
        <Center>
          {!isInRoom && <JoinRoom />}
          {isInRoom && <PongGame />}
        </Center>
        <Center>
          <Link to="matching">
            <Button>Rank Match</Button>
          </Link>
        </Center>
        <Center>
          <Box>
            <h2>Socket IO Information:</h2>
            <p>
              Your user ID: <strong>{uid}</strong>
              <br />
              Users online: <strong>{users.length}</strong>
              <br />
              Socket ID: <strong>{socket?.id}</strong>
              <br />
            </p>
          </Box>
        </Center>
      </ContentLayout>
    </GameContext.Provider>
  );
});
