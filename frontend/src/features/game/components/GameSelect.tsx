import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';

type Props = {
  targetId: string;
};

export const GameSelect: FC<Props> = memo((props) => {
  const { targetId } = props;

  return (
    <Flex align="center" justify="center" height="40vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          Are you ready...?
          {targetId}
        </Heading>
        <Divider />
        <Stack spacing={4} py={4} px={10} align="center">
          <Button>Yes</Button>
        </Stack>
      </Box>
    </Flex>
  );
});
