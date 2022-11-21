import { FC, Suspense, useState, useTransition } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ContentLayout } from 'components/layout/ContentLayout';
import { BlockList } from '../components/BlockUsersList';
import { FriendsList } from '../components/FriendsList';
import { UsersList } from '../components/UsersList';
import { UsersTabButton } from '../components/UsersTabButton';

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
          <UsersTabButton
            isSelect={selectedTab === 'friends'}
            isPending={isPending}
            onClick={() => onClickTabButton('friends')}
          >
            Friends
          </UsersTabButton>
          <UsersTabButton
            isSelect={selectedTab === 'users'}
            isPending={isPending}
            onClick={() => onClickTabButton('users')}
          >
            Users
          </UsersTabButton>
          <UsersTabButton
            isSelect={selectedTab === 'block'}
            isPending={isPending}
            onClick={() => onClickTabButton('block')}
          >
            Block
          </UsersTabButton>

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
