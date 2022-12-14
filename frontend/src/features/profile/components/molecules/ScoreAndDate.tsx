import { memo, FC } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

type Props = {
  score: string;
  createdAt: Date;
};

export const ScoreAndDate: FC<Props> = memo((props) => {
  const { score, createdAt } = props;

  const date = new Date(createdAt);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return (
    <Box>
      <VStack>
        <Text h="32px" fontSize="24px" mb={2}>
          {score}
        </Text>
        <Text h="8px" fontSize="8px">
          {`${year}/${month}/${day}`}
        </Text>
        <Text h="8px" fontSize="8px">
          {`${hour}:${minute < 10 ? '0' + minute.toString() : minute} `}
        </Text>
      </VStack>
    </Box>
  );
});
