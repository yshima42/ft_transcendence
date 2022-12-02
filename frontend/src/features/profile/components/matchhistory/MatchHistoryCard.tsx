import { memo, FC } from 'react';
import { Box, Stack, Text, VStack } from '@chakra-ui/react';
import { useMatchHistory } from 'hooks/api/game/useMatchHistory';
import { GameResultCard } from './GameResultCard';
import { PrevAndNextButton } from './PrevAndNextButton';

type MatchHistoryCardProps = {
  id: string;
};

export const MatchHistoryCard: FC<MatchHistoryCardProps> = memo(
  ({ id }: MatchHistoryCardProps) => {
    const { matchHistory } = useMatchHistory(id);

    // TODO:機能要件の時に変更する。フロントでロジックを書きたくない？
    const latest5Matches = matchHistory.slice(-5);

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
                    userId={match.playerOneId}
                    opponentId={match.playerTwoId}
                    score={`${match.userScore} - ${match.opponentScore}`}
                    createdAt={match.finishededAt}
                    win={match.win}
                  />
                </Box>
              ))}
            </VStack>
            <PrevAndNextButton />
          </Stack>
        </Box>
      </>
    );
  }
);
