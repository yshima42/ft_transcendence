import { memo, FC, useMemo } from 'react';
import { Center } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Confirmation } from '../components/Confirmation';
import { OpponentWaiting } from '../components/OpponentWaiting';
import { PongGame } from '../components/PongGame';
import { Result } from '../components/Result';
import { GamePhase, useGame } from '../hooks/useGame';

export const Game: FC = memo(() => {
  const { id: roomId } = useParams();
  const { gamePhase, setGamePhase, draw, gameResult } = useGame(roomId ?? '');

  const gamePage = useMemo(() => {
    switch (gamePhase) {
      case GamePhase.Joining:
        return <CenterSpinner h="40vh" />;
      case GamePhase.ConfirmWaiting:
        return <Confirmation setGamePhase={setGamePhase} />;
      case GamePhase.Confirming:
        return <CenterSpinner h="40vh" />;
      case GamePhase.OpponentWaiting:
        return <OpponentWaiting />;
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
