import { memo, FC, useState, useMemo, useEffect } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { axios } from 'lib/axios';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { BlockedList } from 'features/friends/components/organisms/BlockedList';
import { FriendsList } from 'features/friends/components/organisms/FriendsList';
import { PendingList } from 'features/friends/components/organisms/PendingList';
import { RecognitionList } from 'features/friends/components/organisms/RecognitionList';
import { RequestableUsersList } from 'features/friends/components/organisms/RequestableUsersList';

const tabs = ['Friends', 'Pending', 'Recognition', 'Blocked', 'Add Friend'];

export const Users: FC = memo(() => {
  const [requestableUsers, setRequestableUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [pending, setPending] = useState<User[]>([]);
  const [recognition, setRecognition] = useState<User[]>([]);
  const [blocked, setBlocked] = useState<User[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  const initialTab = useMemo(() => {
    if (typeof location === 'undefined') return 0;

    return Math.max(tabs.indexOf(location.hash.slice(1)), 0);
  }, []);

  // TODO ここはSearchに置き換わる
  async function getRequestableUsers(): Promise<void> {
    const res: { data: User[] } = await axios.get(
      '/users/me/requestable-users'
    );
    setRequestableUsers(res.data);
  }
  useEffect(() => {
    getRequestableUsers().catch((err) => console.error(err));
  }, [tabIndex]);

  async function getFriends(): Promise<void> {
    const res: { data: User[] } = await axios.get('/users/me/friends');
    setFriends(res.data);
  }
  useEffect(() => {
    getFriends().catch((err) => console.error(err));
  }, [tabIndex]);

  // pending
  async function getPending(): Promise<void> {
    const res: { data: User[] } = await axios.get(
      '/users/me/friend-requests/outgoing'
    );
    setPending(res.data);
  }
  useEffect(() => {
    getPending().catch((err) => console.error(err));
  }, [tabIndex]);

  // recognition
  async function getRecognition(): Promise<void> {
    const res: { data: User[] } = await axios.get(
      '/users/me/friend-requests/incoming'
    );
    setRecognition(res.data);
  }
  useEffect(() => {
    getRecognition().catch((err) => console.error(err));
  }, [tabIndex]);

  // blocked
  async function getBlocked(): Promise<void> {
    const res: { data: User[] } = await axios.get('/users/me/blocks');
    setBlocked(res.data);
  }
  useEffect(() => {
    getBlocked().catch((err) => console.error(err));
  }, [tabIndex]);

  return (
    <ContentLayout title="Users">
      <Tabs
        variant="soft-rounded"
        onChange={(index) => {
          setTabIndex(index);
          location.hash = `#${tabs[index]}`;
        }}
        defaultIndex={initialTab}
      >
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab}>{tab}</Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <FriendsList users={friends} />
          </TabPanel>
          <TabPanel>
            <PendingList users={pending} />
          </TabPanel>
          <TabPanel>
            <RecognitionList users={recognition} />
          </TabPanel>
          <TabPanel>
            <BlockedList users={blocked} />
          </TabPanel>
          <TabPanel>
            <RequestableUsersList users={requestableUsers} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ContentLayout>
  );
});
