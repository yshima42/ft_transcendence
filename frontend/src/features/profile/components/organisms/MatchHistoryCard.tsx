import { memo, FC } from 'react';
import { Box, Flex, Stack, Text, VStack } from '@chakra-ui/react';
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
          <Box pl={3} pb={2}>
            <Text as="b">Match History</Text>
          </Box>
          <VStack justify="center" data-test="profile-latest-5matches">
            {latest5Matches.length === 0 ? (
              <Flex>No Data</Flex>
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
