import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';

export const Login: FC = memo(() => {
  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          TransPong
        </Heading>
        <Divider />
        <Stack spacing={4} py={4} px={10}>
          <Link to="/login-page">
            <Button>42ユーザー認証</Button>
          </Link>
          <Outlet />
          <Button>アドミンテスト1</Button>
          <Button>アドミンテスト2</Button>
          <Button>アドミンテスト3</Button>
        </Stack>
      </Box>
    </Flex>
  );
});