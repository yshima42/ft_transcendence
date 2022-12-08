import { memo, FC, useEffect, useState } from 'react';
import { Box, Button, Center, Stack } from '@chakra-ui/react';
import { SOCKET_URL } from 'config/default';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { JoinRoom } from '../components/JoinRoom';
import { PongGame } from '../components/PongGame';
import GameContext, { GameContextProps } from '../utils/gameContext';
import socketService from '../utils/socketService';

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

  const connectSocket = async () => {
    await socketService.connect(SOCKET_URL).catch((err) => {
      console.log('Error:', err);
    });
  };

  useEffect(() => {
    void connectSocket();
  }, []);

  return (
    <GameContext.Provider value={gameContextValue}>
      <ContentLayout title="">
        <Center>
          {!isInRoom && <JoinRoom />}
          {isInRoom && <PongGame />}
        </Center>
        <Center>
          <Stack spacing={4} py={4} px={10}>
            <Box w="100%" bg="gray.200">
              Stats Information
            </Box>
            <Link to="matching">
              <Button>Rank Match</Button>
            </Link>
          </Stack>
        </Center>
      </ContentLayout>
    </GameContext.Provider>
  );
});
