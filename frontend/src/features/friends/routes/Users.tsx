import { memo, FC, Suspense } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { BlockedList } from 'features/friends/components/organisms/BlockedList';
import { FriendsList } from 'features/friends/components/organisms/FriendsList';
import { PendingList } from 'features/friends/components/organisms/PendingList';
import { RecognitionList } from 'features/friends/components/organisms/RecognitionList';
import { RequestableUsersList } from 'features/friends/components/organisms/RequestableUsersList';

const tabs = ['Friends', 'Pending', 'Recognition', 'Blocked', 'AddFriend'];
const dataTestList = [
  'users-friends-tab',
  'users-pending-tab',
  'users-recognition-tab',
  'users-blocked-tab',
  'users-add-friend-tab',
];

export const Users: FC = memo(() => {
  return (
    <ContentLayout title="Users">
      <Tabs variant="soft-rounded" colorScheme="gray">
        <TabList>
          {tabs.map((tab, index) => (
            <Tab key={tab} data-test={dataTestList[index]}>
              {tab}
            </Tab>
          ))}
        </TabList>
        <Suspense fallback={<CenterSpinner h="80vh" />}>
          <TabPanels>
            <TabPanel>
              <FriendsList />
            </TabPanel>
            <TabPanel>
              <PendingList />
            </TabPanel>
            <TabPanel>
              <RecognitionList />
            </TabPanel>
            <TabPanel>
              <BlockedList />
            </TabPanel>
            <TabPanel>
              <RequestableUsersList />
            </TabPanel>
          </TabPanels>
        </Suspense>
      </Tabs>
    </ContentLayout>
  );
});
