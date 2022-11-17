import { memo, FC, useState } from 'react';

import { Button, Center, Flex } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';
import { ContentLayout } from 'components/templates/ContentLayout';

export const Users: FC = memo(() => {
  const [active, setActive] = useState('Friends');

  return (
    <>
      <ContentLayout title="Users">
        <Center>
          <Flex>
            <Link to="">
              <Button
                size="sm"
                onClick={() => setActive('Friends')}
                bg={active === 'Friends' ? 'gray.300' : 'gray:100'}
                borderRadius="5px"
              >
                Friends
              </Button>
            </Link>
          </Flex>
          <Flex>
            <Link to="all">
              <Button
                size="sm"
                onClick={() => setActive('Users')}
                bg={active === 'Users' ? 'gray.300' : 'gray:100'}
                borderRadius="5px"
              >
                Users
              </Button>
            </Link>
          </Flex>
          <Flex>
            <Link to="block">
              <Button
                size="sm"
                onClick={() => setActive('Block')}
                bg={active === 'Block' ? 'gray.300' : 'gray:100'}
                borderRadius="5px"
              >
                Block
              </Button>
            </Link>
          </Flex>
        </Center>
        <Outlet />
      </ContentLayout>
    </>
  );
});
