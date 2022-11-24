import { memo, FC } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

export const PrevAndNextButton: FC = memo(() => {
  return (
    <Box h="80px">
      <Flex bg="teal.200" justify="center" align="center">
        <Button mx={8}>prev</Button>
        <Button mx={8}>next</Button>
      </Flex>
    </Box>
  );
});
