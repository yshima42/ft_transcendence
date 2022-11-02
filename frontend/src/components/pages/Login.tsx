import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading } from '@chakra-ui/react';

export const Login: FC = memo(() => {
  return (
    <Flex>
      <Box>
        <Heading as="h1">ログイン</Heading>
        <Divider />
        <Button>42ユーザー認証</Button>
      </Box>
    </Flex>
  );
});
