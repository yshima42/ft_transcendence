import { memo, FC } from 'react';
import { Box, Button, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const GameTop: FC = memo(() => {
  return (
    <>
      <Stack spacing={4} py={4} px={10}>
        <Box w="100%" bg="gray.200">
          個人統計情報等を入れる
        </Box>
        <Link to="matching">
          <Button>ランクマッチ</Button>
        </Link>
      </Stack>
    </>
  );
});
