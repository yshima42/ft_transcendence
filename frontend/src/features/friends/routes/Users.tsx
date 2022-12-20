import { memo, FC } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { BlockedList } from 'features/friends/components/organisms/BlockedList';
import { FriendsList } from 'features/friends/components/organisms/FriendsList';
import { PendingList } from 'features/friends/components/organisms/PendingList';
import { RecognitionList } from 'features/friends/components/organisms/RecognitionList';
import { RequestableUsersList } from 'features/friends/components/organisms/RequestableUsersList';

const tabs = ['Friends', 'Pending', 'Recognition', 'Blocked', 'Add Friend'];

export const Users: FC = memo(() => {
  return (
    <ContentLayout title="Users">
      <Tabs variant="soft-rounded">
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab}>{tab}</Tab>
          ))}
        </TabList>
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
      </Tabs>
    </ContentLayout>
  );
});
