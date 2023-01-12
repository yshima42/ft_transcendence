import { memo, FC } from 'react';
import { Box, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import { Auth42Button } from '../components/Auth42Button';
import { DummyAuthButton } from '../components/DummyAuthButton';

export const Login: FC = memo(() => {
  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          TransPong
        </Heading>
        <Divider />
        <Stack spacing={4} py={4} px={10}>
          <Auth42Button />
          <Divider />
          <DummyAuthButton dummyId="dummy001" />
          <DummyAuthButton dummyId="dummy002" />
          <DummyAuthButton dummyId="dummy003" />
        </Stack>
      </Box>
    </Flex>
  );
});
