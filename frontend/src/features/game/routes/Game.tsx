import { memo, FC, useMemo } from 'react';
import { Center } from '@chakra-ui/react';
import { useLocation, useParams } from 'react-router-dom';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Confirmation } from '../components/Confirmation';
import { PongGame } from '../components/PongGame';
import { Result } from '../components/Result';
import { Waiting } from '../components/Waiting';
import { GamePhase, useGame } from '../hooks/useGame';

export const Game: FC = memo(() => {
  const { isLeftSide } = useLocation().state as { isLeftSide: boolean };
  const { id: roomId } = useParams();
  const { gamePhase, setGamePhase, draw, gameResult } = useGame(
    roomId ?? '',
    isLeftSide
  );

  const gamePage = useMemo(() => {
    switch (gamePhase) {
      case GamePhase.SocketConnecting:
      case GamePhase.Joining:
        return <CenterSpinner isFullScreen />;
      case GamePhase.Confirming:
        return <Confirmation setGamePhase={setGamePhase} />;
      case GamePhase.Waiting:
        return <Waiting />;
      case GamePhase.InGame:
        return <PongGame draw={draw} />;
      case GamePhase.Result:
        return <Result gameResult={gameResult} />;
    }
  }, [gamePhase, setGamePhase, draw, gameResult]);

  return (
    <ContentLayout title="">
      <Center>{gamePage}</Center>
    </ContentLayout>
  );
});
