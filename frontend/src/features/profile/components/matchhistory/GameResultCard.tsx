import { memo, FC } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import { AvatarWithName } from './AvatarWithName';
import { PointAndDate } from './PointAndDate';

type Props = {
  name: string;
  avatarUrl: string;
  point: string;
  date: string;
  result: string;
};

export const GameResultCard: FC<Props> = memo((props) => {
  const { name, avatarUrl, point, date, result } = props;

  return (
    <Box h="90px" bg="gray.200" borderRadius={20} px={4}>
      <HStack justify="center" align="center">
        <AvatarWithName name={name} avatarUrl={avatarUrl} />
        <PointAndDate point={point} date={date} />
        <AvatarWithName name={name} avatarUrl={avatarUrl} />
        <Box p={4}>
          <Text as="b">{result}</Text>
        </Box>
      </HStack>
    </Box>
  );
});
