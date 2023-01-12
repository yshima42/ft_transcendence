import { memo, FC } from 'react';
import { TimeIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Heading, Stack, VStack } from '@chakra-ui/react';
import { useMatchHistory } from 'hooks/api/game/useMatchHistory';
import { GameResultCard } from '../molecules/GameResultCard';

type Props = {
  id: string;
  isLoginUser: boolean;
};

export const MatchHistoryCard: FC<Props> = memo((props) => {
  const { id, isLoginUser } = props;
  const { matchHistory } = useMatchHistory(isLoginUser ? 'me' : id);

  const latest5Matches = matchHistory.slice(0, 5);

  return (
    <>
      <Flex
        w="100%"
        h="100%"
        bg="gray.200"
        borderRadius="20px"
        shadow="md"
        p={3}
        pt={5}
        direction="column"
      >
        <Stack>
          <Flex pl={3} pb={2}>
            <TimeIcon w="6" h="6" pr="2" />
            <Heading size="md">Match History</Heading>
          </Flex>
          <VStack justify="center" data-test="profile-latest-5matches">
            {latest5Matches.length === 0 ? (
              <Center h="450px">
                <Flex color="gray.600">No Match History</Flex>
              </Center>
            ) : (
              latest5Matches.map((match) => (
                <Box key={match.id}>
                  <GameResultCard
                    matchId={match.id}
                    playerOne={match.playerOne}
                    playerTwo={match.playerTwo}
                    score={`${match.playerOneScore} - ${match.playerTwoScore}`}
                    createdAt={match.finishedAt}
                    win={
                      (id === match.playerOne.id &&
                        match.playerOneScore === 5) ||
                      (id === match.playerTwo.id && match.playerTwoScore === 5)
                    }
                  />
                </Box>
              ))
            )}
          </VStack>
        </Stack>
      </Flex>
    </>
  );
});
