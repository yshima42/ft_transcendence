import { memo, FC } from 'react';
import { ChatsList } from '../components/ChatsList';

export const Chats: FC = memo(() => {
  return <ChatsList />;
});
