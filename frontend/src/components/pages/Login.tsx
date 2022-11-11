import { memo, FC } from 'react';
// import { memo, FC, useContext } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import axios from 'axios';
// import axios, { AxiosResponse } from 'axios';
// import { AccessTokenContext } from 'hooks/providers/useAccessTokenProvider';
import { useAuth } from 'hooks/providers/useAuthProvider';
import { Outlet, useNavigate } from 'react-router-dom';
import { AccessToken } from 'types/api/accessToken';

export const Login: FC = memo(() => {
  // const { token, setToken } = useContext(AccessTokenContext);

  const navigate = useNavigate();
  const auth = useAuth();

  const to = '/user-list';

  const onClickDummy1 = () => {
    const params = new URLSearchParams();
    params.append('name', 'dummy1');
    axios
      .post<AccessToken[]>('http://localhost:3000/auth/login/dummy', params, {
        withCredentials: true,
      })
      .then(() => {
        // .then((result: AxiosResponse<AccessToken[]>) => {
        // setToken(result.data.accessToken as string);
        // 上有効化
        // 下2行消す
        // console.log(result);
        // setToken('');
        // console.log(token);
        auth.signin('dummy1', () => {
          navigate(to, { replace: true });
        });
      })
      .catch(() => console.log('error'));
    // auth.signin('dummy1', () => {
    //   navigate(to, { replace: true });
    // });
  };

  const onClickDummy2 = () => {
    axios
      .get('http://localhost:3000/auth/login/42', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => console.log(res.data))
      .catch(() => alert('error'));
  };

  const onClickDummy3 = () => {
    const params = new URLSearchParams();
    axios
      .post('http://localhost:3000/auth/logout', params, {
        withCredentials: true,
      })
      .then((res) => console.log(res.data))
      .catch(() => alert('error'));
  };

  const onClickDummy4 = () => {
    axios
      .get('http://localhost:3000/user/all', { withCredentials: true })
      .then((res) => console.log(res.data))
      .catch(() => alert('error'));
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
          <Button onClick={onClickDummy2}>アドミンテスト2</Button>
          <Button onClick={onClickDummy3}>アドミンテスト3</Button>
          <Button onClick={onClickDummy4}>アドミンテスト4</Button>
        </Stack>
      </Box>
    </Flex>
  );
});
