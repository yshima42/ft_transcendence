import { memo, FC } from 'react';

import { Center } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { ContentLayout } from 'components/templates/ContentLayout';
import { UsersTopTab } from '../components/UsersTopTab';

export const Users: FC = memo(() => {
  return (
    <>
      <ContentLayout title="Users">
        <Center>
          <UsersTopTab />
        </Center>
        <Outlet />
      </ContentLayout>
    </>
  );
});
