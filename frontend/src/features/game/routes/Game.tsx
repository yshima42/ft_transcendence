import { memo, FC, useMemo } from 'react';
import { Center } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Confirmation } from '../components/Confirmation';
import { OpponentWaiting } from '../components/OpponentWaiting';
import { PlayerWaiting } from '../components/PlayerWaiting';
import { PongGame } from '../components/PongGame';
import { Result } from '../components/Result';
import { GamePhase, useGame } from '../hooks/useGame';

export const Game: FC = memo(() => {
  const { id: roomId } = useParams();
  const { gamePhase, setGamePhase, draw, player1, player2, countDownNum } =
    useGame(roomId ?? '');

  const gamePage = useMemo(() => {
    switch (gamePhase) {
      case GamePhase.SocketConnecting:
      case GamePhase.Joining:
        return <CenterSpinner h="40vh" />;
      case GamePhase.ConfirmWaiting:
        return (
          <Confirmation
            setGamePhase={setGamePhase}
            countDownNum={countDownNum}
          />
        );
      case GamePhase.Confirming:
        return <CenterSpinner h="40vh" />;
      case GamePhase.OpponentWaiting:
        return <OpponentWaiting />;
      case GamePhase.PlayerWaiting:
        return <PlayerWaiting />;
      case GamePhase.InGame:
      case GamePhase.Watch:
        return <PongGame draw={draw} />;
      case GamePhase.Result:
        return <Result player1={player1} player2={player2} />;
    }
  }, [gamePhase, setGamePhase, draw, player1, player2, countDownNum]);

  return (
    <ContentLayout title="">
      <Center>{gamePage}</Center>
    </ContentLayout>
  );
});
