import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';
import { useDummyAuth } from '../api/useDummyAuth';

export const Login: FC = memo(() => {
  const { dummyLogin, loading } = useDummyAuth();

  const onClickDummy1 = () => dummyLogin('dummy1');
  const onClickDummy2 = () => dummyLogin('dummy2');
  const onClickDummy3 = () => dummyLogin('dummy3');

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
          <PrimaryButton loading={loading} onClick={onClickDummy1}>
            アドミンテスト1
          </PrimaryButton>
          <PrimaryButton loading={loading} onClick={onClickDummy2}>
            アドミンテスト2
          </PrimaryButton>
          <PrimaryButton loading={loading} onClick={onClickDummy3}>
            アドミンテスト3
          </PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  );
});
