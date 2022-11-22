import { FC, useState } from 'react';
import { ContentLayout } from 'components/layout/ContentLayout';
import { BlockList } from '../components/BlockUsersList';
import { FriendsList } from '../components/FriendsList';
import { UsersList } from '../components/UsersList';
import { UsersTabButton } from '../components/UsersTabButton';

type Tabs = 'friends' | 'users' | 'block';

export const Users: FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tabs>('friends');

  const onClickTabButton = (tab: Tabs) => {
    setSelectedTab(tab);
  };

  return (
    <ContentLayout title="Users">
      <UsersTabButton
        isSelect={selectedTab === 'friends'}
        onClick={() => onClickTabButton('friends')}
      >
        Friends
      </UsersTabButton>
      <UsersTabButton
        isSelect={selectedTab === 'users'}
        onClick={() => onClickTabButton('users')}
      >
        Users
      </UsersTabButton>
      <UsersTabButton
        isSelect={selectedTab === 'block'}
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
