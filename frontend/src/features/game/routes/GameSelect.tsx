import { memo, FC } from 'react';
import { Button, Stack } from '@chakra-ui/react';

export const GameSelect: FC = memo(() => {
  return (
    <>
      <Stack spacing={4} py={4} px={10}>
        <Button>ランダムマッチ</Button>
        <Button>フレンドマッチ</Button>
        <Button>観戦</Button>
      </Stack>
    </>
  );
});
