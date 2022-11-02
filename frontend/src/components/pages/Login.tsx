import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import axios from 'axios';
import { User } from 'types/api/user';
// import { PrimaryButton } from 'components/atoms/button/PrimaryButton';

export const Login: FC = memo(() => {
  const API_URL = 'https://api.intra.42.fr/v2/me';
  // ここのアクセストークンは現状手動で取ってくる
  const ACCESS_TOKEN =
    '012bf266174087b6318c2cf1526c914cf5d033b58183df72bb724ffdf5badfb7';

  const onClickAuth = () => {
    axios
      .get<User[]>(API_URL, {
        headers: { Authorization: 'Bearer ' + ACCESS_TOKEN },
      })
      .then((res) => {
        console.log(res.data);
        // eslintに怒られるのでコメントアウト
        // alert(`Hello ${res.data.login}`);
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          TransPong
        </Heading>
        <Divider />
        <Stack spacing={4} py={4} px={10}>
          <Button onClick={onClickAuth}>42ユーザー認証</Button>
          <Button>アドミンテスト1</Button>
          <Button>アドミンテスト2</Button>
          <Button>アドミンテスト3</Button>
        </Stack>
      </Box>
    </Flex>
  );
});
