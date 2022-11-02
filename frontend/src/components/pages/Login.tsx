import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import axios from 'axios';
// import { AccessToken } from 'types/api/accessToken';
import { User } from 'types/api/user';
// import { PrimaryButton } from 'components/atoms/button/PrimaryButton';

export const Login: FC = memo(() => {
  // ②に使うデータ
  // const CLIENT_ID =
  //   '13048d1985df54479741344156321e0b0d101970ad8c152c72f3de8c508c00a2';
  // const CLIENT_SECRET =
  //   '';
  // const CODE =
  //   '1ec9adee482186608f021b228241cc847b86a3fcd175075ebc3752c27a9559fd';

  // ③に使うデータ
  const API_URL = 'https://api.intra.42.fr/v2/me';
  // ここのアクセストークンは現状手動で取ってくる
  const ACCESS_TOKEN =
    '012bf266174087b6318c2cf1526c914cf5d033b58183df72bb724ffdf5badfb7';

  const onClickAuth = () => {
    // ① codeを取得
    // 未実装

    // ② codeを使ってアクセストークンを取得
    // エラー出るので一旦コメントアウト
    // const params = new FormData();
    // params.append('grant_type', 'authorization_code');
    // params.append('client_id', CLIENT_ID);
    // params.append('client_secret', CLIENT_SECRET);
    // params.append('code', CODE);
    // params.append('redirect_uri', 'https://42tokyo.jp');
    // axios
    //   .post<AccessToken[]>('https://api.intra.42.fr/oauth/token', params, {
    //     headers: {
    //       'content-type': 'multipart/form-data',
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log('err: ', err);
    //   });

    // ③ アクセストークンを使ってloginIdを取ってくる
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
