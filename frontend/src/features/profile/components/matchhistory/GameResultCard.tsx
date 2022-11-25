import { memo, FC, useEffect } from 'react';
import { Box, Center, HStack, Spinner, Text } from '@chakra-ui/react';
import { useMe } from 'hooks/useMe';
import { useOpponent } from 'hooks/useOpponent';
import { AvatarWithName } from './AvatarWithName';
import { ScoreAndDate } from './ScoreAndDate';

type Props = {
  opponentId: string;
  score: string;
  createdAt: Date;
  win: boolean;
};

export const GameResultCard: FC<Props> = memo((props) => {
  const { opponentId, score, createdAt, win } = props;
  const { getMe, meLoading, me } = useMe();
  const { getOpponent, opponentLoading, opponent } = useOpponent();
  useEffect(() => getMe(), [getMe]);
  useEffect(() => getOpponent(opponentId), [getOpponent]);

  if (me === undefined || opponent === undefined) return <></>;

  return (
    <>
      {meLoading || opponentLoading ? (
        <Center h="100vh">
          <Spinner color="teal.200" />
        </Center>
      ) : (
        <Box h="90px" bg="gray.200" borderRadius={20} px={4}>
          <HStack>
            <AvatarWithName name={me.nickname} avatarUrl={me.avatarUrl} />
            <ScoreAndDate score={score} createdAt={createdAt} />
            <AvatarWithName
              name={opponent.nickname}
              avatarUrl={opponent.avatarUrl}
            />
            <Box w="50px">
              <Center>
                <Text as="b">{win ? 'Win!!' : 'Lose...'}</Text>
              </Center>
            </Box>
          </HStack>
        </Box>
      )}
    </>
  );
});