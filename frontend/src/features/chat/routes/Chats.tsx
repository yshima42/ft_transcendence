import { memo, FC } from 'react';
import { ContentLayout } from 'components/layout/ContentLayout';
import { ChatsList } from '../components/ChatsList';

export const Chats: FC = memo(() => {
  return (
    <ContentLayout title="Chat Room">
      <ChatsList />
    </ContentLayout>
  );
});
