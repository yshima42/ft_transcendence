import { memo, FC } from 'react';
import {
  Box,
  Divider,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';

type Props = {
  countDownNum: number;
};

export const OpponentWaiting: FC<Props> = memo((props) => {
  const { countDownNum } = props;

  return (
    <Flex align="center" justify="center" height="40vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          Waiting for the opponent&apos;s confirmation...
        </Heading>
        <Text textAlign="center">{countDownNum}</Text>
        <Divider />
        <Stack spacing={4} py={4} px={10} align="center">
          <Spinner />
        </Stack>
      </Box>
    </Flex>
  );
});
