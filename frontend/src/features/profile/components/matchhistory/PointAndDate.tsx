import { memo, FC } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

type Props = {
  point: string;
  date: Date;
};

export const PointAndDate: FC<Props> = memo((props) => {
  const { point, date } = props;

  return (
    <Box w={20}>
      <VStack>
        <Text h="32px" fontSize="24px" mb={1}>
          {point}
        </Text>
        <Text h="8px" fontSize="xs">
          {date.toDateString()}
        </Text>
      </VStack>
    </Box>
  );
});
