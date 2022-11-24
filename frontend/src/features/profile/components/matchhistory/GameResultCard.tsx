import { memo, FC } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import { AvatarWithName } from './AvatarWithName';
import { PointAndDate } from './PointAndDate';

type Props = {
  name: string;
  avatarUrl: string;
  userScore: number;
  opponentScore: number;
  createdAt: Date;
  win: boolean;
};

export const GameResultCard: FC<Props> = memo((props) => {
  const { name, avatarUrl, userScore, opponentScore, createdAt, win } = props;

  return (
    <Box h="90px" bg="gray.200" borderRadius={20} px={4}>
      <HStack justify="center" align="center">
        <AvatarWithName name={name} avatarUrl={avatarUrl} />
        <PointAndDate
          point={`${userScore}-${opponentScore}`}
          date={createdAt}
        />
        <AvatarWithName name={name} avatarUrl={avatarUrl} />
        <Box p={4}>
          <Text as="b">{win ? 'Win!!' : 'Lose...'}</Text>
        </Box>
      </HStack>
    </Box>
  );
});
