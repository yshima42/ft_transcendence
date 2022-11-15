import { memo, FC } from 'react';

import { Button, Center, Flex } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';
import { ContentLayout } from 'components/templates/ContentLayout';

export const Users: FC = memo(() => {
  return (
    <>
      <ContentLayout title="Users">
        <Center>
          <Flex>
            <Link to="">
              <Button size="sm">Friends</Button>
            </Link>
          </Flex>
          <Flex>
            <Link to="all">
              <Button size="sm">Users</Button>
            </Link>
          </Flex>
          <Flex>
            <Link to="block">
              <Button size="sm">Block</Button>
            </Link>
          </Flex>
        </Center>
        <Outlet />
      </ContentLayout>
    </>
  );
});
