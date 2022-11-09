import { memo, FC, useContext } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import axios from 'axios';
import { AccessTokenContext } from 'hooks/providers/useAccessTokenProvider';
import { useAuth } from 'hooks/providers/useAuthProvider';
import { Outlet, useNavigate } from 'react-router-dom';

export const Login: FC = memo(() => {
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);

  const navigate = useNavigate();
  const auth = useAuth();

  const to = '/user-list';

  const onClickDummy1 = () => {
    const params = new URLSearchParams();
    params.append('name', 'dummy1');
    axios
      .post('http://localhost:3000/auth/login/dummy', params)
      .then((result) => {
        // const at: string = result.data as string;
        // console.log(at);
        // console.log(result.data as string);

        setAccessToken(result.data as string);
        console.log(accessToken);

        auth.signin('dummy1', () => {
          navigate(to, { replace: true });
        });
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
