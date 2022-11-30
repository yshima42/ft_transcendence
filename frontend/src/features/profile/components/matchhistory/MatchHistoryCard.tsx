import { memo, FC, useEffect } from 'react';
import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { useAllMatches } from 'features/profile/hooks/useAllMatches';
import { GameResultCard } from './GameResultCard';
import { PrevAndNextButton } from './PrevAndNextButton';

export const MatchHistoryCard: FC = memo(() => {
  const { getMatches, loading, matches } = useAllMatches();
  useEffect(() => getMatches(), [getMatches]);

  // TODO:機能要件の時に変更する。フロントでロジックを書きたくない？
  const latest5Matches = matches.slice(-5);

  return (
    <>
      {loading ? (
        <Center h="100vh">
          <Spinner color="teal.200" />
        </Center>
      ) : (
        <Box>
          <Stack>
            <Box p={2}>
              <Text as="b">Match History</Text>
            </Box>
            <VStack justify="center">
              {latest5Matches.map((match) => (
                <Box key={match.id}>
                  <GameResultCard
                    opponentId={match.playerTwoId}
                    score={`${match.userScore} - ${match.opponentScore}`}
                    createdAt={match.startedAt}
                    win={match.win}
                  />
                </Box>
              ))}
            </VStack>
            <PrevAndNextButton />
          </Stack>
        </Box>
      )}
    </>
  );
});
