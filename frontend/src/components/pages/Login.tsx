import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

export const Login: FC = memo(() => {
  const onClickDummy1 = () => {
    const params = new URLSearchParams();
    params.append('name', 'dummy1');
    axios
      .post('http://localhost:3000/auth/login/dummy', params)
      .then((result) => {
        console.log(result);
      })
      .catch(() => console.log('error'));
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          TransPong
        </Heading>
        <Divider />
        <Stack spacing={4} py={4} px={10}>
          <a href="http://localhost:3000/auth/login/42">
            <Button>42ユーザー認証</Button>
          </a>
          <Outlet />
          <Button onClick={onClickDummy1}>アドミンテスト1</Button>
          <Button>アドミンテスト2</Button>
          <Button>アドミンテスト3</Button>
        </Stack>
      </Box>
    </Flex>
  );
});
