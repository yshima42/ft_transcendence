import { memo, FC } from 'react';
import { Box, Center, HStack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { AvatarWithName } from './AvatarWithName';
import { ScoreAndDate } from './ScoreAndDate';

type Props = {
  user: User;
  opponent: User;
  score: string;
  createdAt: Date;
  win: boolean;
};

export const GameResultCard: FC<Props> = memo((props) => {
  const { user, opponent, score, createdAt, win } = props;

  // TODO:spinnerつける？使うフックを変更し、一時的にspinner表示を削除した
  return (
    <>
      <Box h="90px" bg="gray.200" borderRadius={20} px={4}>
        <HStack>
          <AvatarWithName
            name={user.nickname}
            avatarImageUrl={user.avatarImageUrl}
            id={user.id}
          />
          <ScoreAndDate score={score} createdAt={createdAt} />
          <AvatarWithName
            name={opponent.nickname}
            avatarImageUrl={opponent.avatarImageUrl}
            id={opponent.id}
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
