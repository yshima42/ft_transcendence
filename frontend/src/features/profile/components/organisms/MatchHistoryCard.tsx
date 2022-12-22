import { memo, FC } from 'react';
import { Box, Stack, Text, VStack } from '@chakra-ui/react';
import { useMatchHistory } from 'hooks/api/game/useMatchHistory';
import { GameResultCard } from '../molecules/GameResultCard';

type Props = {
  id: string;
  isLoginUser: boolean;
};

export const MatchHistoryCard: FC<Props> = memo((props) => {
  const { id, isLoginUser } = props;
  const { matchHistory } = useMatchHistory(isLoginUser ? 'me' : id);

  // TODO:機能要件の時に変更する。フロントでロジックを書きたくない？
  const latest5Matches = matchHistory.slice(0, 5);

  return (
    <>
      {/* TODO:spinnerつける？使うフックを変更し、一時的にspinner表示を削除した */}
      <Box>
        <Stack>
          <Box p={2}>
            <Text as="b">Match History</Text>
          </Box>
          <VStack justify="center">
            {latest5Matches.map((match) => (
              <Box key={match.id}>
                <GameResultCard
                  playerOne={match.playerOne}
                  playerTwo={match.playerTwo}
                  score={`${match.playerOneScore} - ${match.playerTwoScore}`}
                  createdAt={match.finishedAt}
                  win={
                    (id === match.playerOne.id && match.playerOneScore === 5) ||
                    (id === match.playerTwo.id && match.playerTwoScore === 5)
                  }
                />
              </Box>
            ))}
          </VStack>
        </Stack>
      </Box>
    </>
  );
});
