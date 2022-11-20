import { FC, Suspense, useState, useTransition } from 'react';
import { Button } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { ContentLayout } from 'components/templates/ContentLayout';
import { BlockList } from '../components/BlockUsersList';
import { FriendsList } from '../components/FriendsList';
import { UsersList } from '../components/UsersList';

type Tabs = 'friends' | 'users' | 'block';

export const Users: FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tabs>('friends');
  const [isPending, startTransition] = useTransition();

  const onClickTabButton = (tab: Tabs) => {
    startTransition(() => {
      setSelectedTab(tab);
    });
  };

  return (
    <ContentLayout title="Users">
      <ErrorBoundary fallback={<h1>Error</h1>}>
        <Suspense fallback={<p>Now loading...</p>}>
          <Button
            size="sm"
            mr={2}
            bg={selectedTab === 'friends' ? 'teal.100' : 'gray.100'}
            borderRadius="5px"
            opacity={isPending ? 0.5 : 1}
            onClick={() => onClickTabButton('friends')}
          >
            Friends
          </Button>
          <Button
            size="sm"
            mr={2}
            bg={selectedTab === 'users' ? 'teal.100' : 'gray.100'}
            borderRadius="5px"
            opacity={isPending ? 0.5 : 1}
            onClick={() => onClickTabButton('users')}
          >
            Users
          </Button>
          <Button
            size="sm"
            mr={2}
            bg={selectedTab === 'block' ? 'teal.100' : 'gray.100'}
            borderRadius="5px"
            opacity={isPending ? 0.5 : 1}
            onClick={() => onClickTabButton('block')}
          >
            Block
          </Button>

          {selectedTab === 'friends' ? (
            <FriendsList />
          ) : selectedTab === 'users' ? (
            <UsersList />
          ) : (
            <BlockList />
          )}
        </Suspense>
      </ErrorBoundary>
    </ContentLayout>
  );
};

// import { memo, FC } from 'react';

// import { Center } from '@chakra-ui/react';
// import { Outlet } from 'react-router-dom';
// import { ContentLayout } from 'components/templates/ContentLayout';
// import { UsersTopTab } from '../components/UsersTopTab';

// export const Users: FC = memo(() => {
//   return (
//     <>
//       <ContentLayout title="Users">
//         <Center>
//           <UsersTopTab />
//         </Center>
//         <Outlet />
//       </ContentLayout>
//     </>
//   );
// });
