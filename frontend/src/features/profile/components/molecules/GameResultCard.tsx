import { memo, FC } from 'react';
import { Box, Center, HStack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { AvatarWithNickname } from './AvatarWithNickname';
import { ScoreAndDate } from './ScoreAndDate';

type Props = {
  matchId: string;
  playerOne: User;
  playerTwo: User;
  score: string;
  createdAt: Date;
  win: boolean;
};

export const GameResultCard: FC<Props> = memo((props) => {
  const { matchId, playerOne, playerTwo, score, createdAt, win } = props;

  return (
    <>
      <Box h="100px" bg="gray.50" borderRadius={20} px={4}>
        <HStack>
          <AvatarWithNickname
            nickname={playerOne.nickname}
            avatarImageUrl={playerOne.avatarImageUrl}
            id={playerOne.id}
          />
          <ScoreAndDate score={score} createdAt={createdAt} />
          <AvatarWithNickname
            nickname={playerTwo.nickname}
            avatarImageUrl={playerTwo.avatarImageUrl}
            id={playerTwo.id}
          />
          <Box w="50px">
            <Center>
              <Text as="b" data-test={'profile-match-result-' + matchId}>
                {win ? 'Win!!' : 'Lose...'}
              </Text>
            </Center>
          </Box>
        </HStack>
      </Box>
    </>
  );
});
