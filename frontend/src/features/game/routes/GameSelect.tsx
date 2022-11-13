import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';

export const GameSelect: FC = memo(() => {
  return (
    <>
      <p>GameSelectページです</p>
      <Button>ランダムマッチ</Button>
      <Button>フレンドマッチ</Button>
      <Button>ライブ観戦</Button>
    </>
  );
});
