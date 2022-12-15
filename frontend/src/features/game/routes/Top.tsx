import { memo, FC, useMemo } from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { JoinRoom } from '../components/JoinRoom';
import { PongGame } from '../components/PongGame';
import { Result } from '../components/Result';
import { GamePhase, useGame } from '../hooks/useGame';
import { Matching } from './Matching';

export const Top: FC = memo(() => {
  const { gamePhase, setGamePhase } = useGame();

  const gamePage = useMemo(() => {
    switch (gamePhase) {
      case GamePhase.Top:
        return <JoinRoom setGamePhase={setGamePhase} />;
      case GamePhase.Matching:
        return <Matching />;
      case GamePhase.WaitStart:
        return <Spinner />;
      case GamePhase.InGame:
        return <PongGame />;
      case GamePhase.Result:
        return <Result />;
      // TODO: 仮実装
      default:
        return <p>Error</p>;
    }
  }, [gamePhase, setGamePhase]);

  return (
    <ContentLayout title="">
      <Center>{gamePage}</Center>
    </ContentLayout>
  );
});
