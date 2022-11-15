import { memo, FC } from 'react';
import { ContentLayout } from 'components/templates/ContentLayout';
import { ChatsList } from '../components/ChatsList';

export const Chats: FC = memo(() => {
  return (
    <ContentLayout title="チャットルーム">
      <ChatsList />
    </ContentLayout>
  );
});
