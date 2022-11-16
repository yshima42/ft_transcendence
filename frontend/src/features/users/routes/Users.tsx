import { memo, FC } from 'react';

import { Button, Center, Flex } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';

// ここにはコンテンツのレイアウトコンポーネントを追加する予定
export const Users: FC = memo(() => {
  return (
    <>
      <Center>
        <Flex>
          <Link to="">
            <Button size="sm">フレンド</Button>
          </Link>
        </Flex>
        <Flex>
          <Link to="all">
            <Button size="sm">ユーザー</Button>
          </Link>
        </Flex>
        <Flex>
          <Link to="block">
            <Button size="sm">ブロック</Button>
          </Link>
        </Flex>
      </Center>
      <Outlet />
    </>
  );
});
