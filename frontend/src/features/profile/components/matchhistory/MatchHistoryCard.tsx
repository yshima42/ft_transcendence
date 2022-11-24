import { memo, FC, useEffect } from 'react';
import { Box, Center, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { useAllMatches } from 'features/profile/hooks/useAllMatches';
import { GameResultCard } from './GameResultCard';
import { PrevAndNextButton } from './PrevAndNextButton';

export const MatchHistoryCard: FC = memo(() => {
  const { getMatches, loading, matches } = useAllMatches();
  useEffect(() => getMatches(), [getMatches]);

  console.log(matches);

  return (
    <>
      {loading ? (
        <Center h="100vh">
          <Spinner color="teal.200" />
        </Center>
      ) : (
        <Box>
          <Stack>
            <Box bg="teal.200" p={2}>
              <Text as="b">Match History</Text>
            </Box>
            <VStack bg="teal.200" justify="center" align="center">
              <GameResultCard
                name="name"
                avatarUrl="https://source.unsplash.com/random"
                userScore={matches[0].userScore}
                opponentScore={matches[0].opponentScore}
                createdAt={matches[0].createdAt}
                win={matches[0].win}
              />
            </VStack>
            <PrevAndNextButton />
          </Stack>
        </Box>
      )}
    </>
  );
});
