import { memo, FC } from 'react';
import { Box, Divider, Flex, Heading, Spinner, Stack } from '@chakra-ui/react';

export const OpponentWaiting: FC = memo(() => {
  return (
    <Flex align="center" justify="center" height="40vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          Waiting for the opponent&apos;s confirmation...
        </Heading>
        <Divider />
        <Stack spacing={4} py={4} px={10} align="center">
          <Spinner />
        </Stack>
      </Box>
    </Flex>
  );
});
