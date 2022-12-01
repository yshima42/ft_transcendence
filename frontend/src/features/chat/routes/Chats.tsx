import { memo, FC } from 'react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChatsList } from '../components/ChatsList';

export const Chats: FC = memo(() => {
  return (
    <ContentLayout title="Chat Room">
      <ChatsList />
    </ContentLayout>
  );
});
