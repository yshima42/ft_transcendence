import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';

export const Login: FC = memo(() => {
  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          TransPong
        </Heading>
        <Divider />
        <Stack spacing={4} py={4} px={10}>
          <PrimaryButton>42ユーザー認証</PrimaryButton>
          <Button>アドミンテスト1</Button>
          <Button>アドミンテスト2</Button>
          <Button>アドミンテスト3</Button>
        </Stack>
      </Box>
    </Flex>
  );
});
