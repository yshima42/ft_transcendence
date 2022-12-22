import { memo, FC } from 'react';
import { Box, Center, HStack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { AvatarWithNickname } from './AvatarWithNickname';
import { ScoreAndDate } from './ScoreAndDate';

type Props = {
  playerOne: User;
  playerTwo: User;
  score: string;
  createdAt: Date;
  win: boolean;
};

export const GameResultCard: FC<Props> = memo((props) => {
  const { playerOne, playerTwo, score, createdAt, win } = props;

  // TODO:spinnerつける？使うフックを変更し、一時的にspinner表示を削除した
  return (
    <>
      <Box h="100px" bg="gray.200" borderRadius={20} px={4}>
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
              <Text as="b">{win ? 'Win!!' : 'Lose...'}</Text>
            </Center>
          </Box>
        </HStack>
      </Box>
    </>
  );
});