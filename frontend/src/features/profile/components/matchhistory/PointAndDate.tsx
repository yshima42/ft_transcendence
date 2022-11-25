import { memo, FC } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

type Props = {
  point: string;
  createdAt: Date;
};

export const PointAndDate: FC<Props> = memo((props) => {
  const { point, createdAt } = props;

  const date = new Date(createdAt);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return (
    <Box>
      <VStack>
        <Text h="32px" fontSize="24px" mb={1}>
          {point}
        </Text>
        <Text h="8px" fontSize="4px">
          {`${year}/${month}/${day} ${hour}:${minute}`}
        </Text>
      </VStack>
    </Box>
  );
});
