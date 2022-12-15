import { memo, FC, useMemo } from 'react';
import { Center } from '@chakra-ui/react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Confirmation } from '../components/Confirmation';
import { GameTop } from '../components/GameTop';
import { Matching } from '../components/Matching';
import { PongGame } from '../components/PongGame';
import { Result } from '../components/Result';
import { Waiting } from '../components/Waiting';
import { GamePhase, useGame } from '../hooks/useGame';

export const Top: FC = memo(() => {
  const { gamePhase, setGamePhase, draw, gameResult } = useGame();

  const gamePage = useMemo(() => {
    switch (gamePhase) {
      case GamePhase.Top:
        return <GameTop setGamePhase={setGamePhase} />;
      case GamePhase.Matching:
        return <Matching />;
      case GamePhase.Confirmation:
        return <Confirmation setGamePhase={setGamePhase} />;
      case GamePhase.Waiting:
        return <Waiting />;
      case GamePhase.InGame:
        return <PongGame draw={draw} />;
      case GamePhase.Result:
        return <Result gameResult={gameResult} />;
    }
  }, [gamePhase, setGamePhase, draw]);

  return (
    <ContentLayout title="">
      <Center>{gamePage}</Center>
    </ContentLayout>
  );
});
