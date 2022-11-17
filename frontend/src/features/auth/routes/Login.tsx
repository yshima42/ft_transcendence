import { memo, FC, useState } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';
import { useDummyAuth } from '../hooks/useDummyAuth';

export const Login: FC = memo(() => {
  const { dummyLogin, loading } = useDummyAuth();

  const [loading42, setLoading42] = useState(false);

  const onClick42 = () => {
    setLoading42(true);
  };

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
          <Button
            bg="teal.900"
            color="white"
            isLoading={loading42}
            loadingText="Loading"
            onClick={onClick42}
            as="a"
            href="http://localhost:3000/auth/login/42"
          >
            42 Auth
          </Button>
          <Divider />
          <PrimaryButton loading={loading} onClick={onClickDummy1}>
            Admin Test 1
          </PrimaryButton>
          <PrimaryButton loading={loading} onClick={onClickDummy2}>
            Admin Test 2
          </PrimaryButton>
          <PrimaryButton loading={loading} onClick={onClickDummy3}>
            Admin Test 3
          </PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  );
});
