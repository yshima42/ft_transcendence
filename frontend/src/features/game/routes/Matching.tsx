import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';

export const Matching: FC = memo(() => {
  return (
    <>
      <p>マッチング画面です</p>
      <Link to="starting">
        <Button>マッチングしたと仮定するボタン</Button>
      </Link>
      <Outlet />
    </>
  );
});
