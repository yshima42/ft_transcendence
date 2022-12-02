import { memo, FC } from 'react';
import { Box, Center, HStack, Text } from '@chakra-ui/react';
import { useProfile } from 'hooks/api/profile/useProfile';
import { AvatarWithName } from './AvatarWithName';
import { ScoreAndDate } from './ScoreAndDate';

type Props = {
  userId: string;
  opponentId: string;
  score: string;
  createdAt: Date;
  win: boolean;
};

export const GameResultCard: FC<Props> = memo((props) => {
  const { userId, opponentId, score, createdAt, win } = props;
  const user = useProfile(userId).user;
  const opponent = useProfile(opponentId).user;

  // TODO:spinnerつける？使うフックを変更し、一時的にspinner表示を削除した
  return (
    <>
      <Box h="90px" bg="gray.200" borderRadius={20} px={4}>
        <HStack>
          <AvatarWithName
            name={user.nickname}
            avatarImageUrl={user.avatarImageUrl}
          />
          <ScoreAndDate score={score} createdAt={createdAt} />
          <AvatarWithName
            name={opponent.nickname}
            avatarImageUrl={opponent.avatarImageUrl}
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
