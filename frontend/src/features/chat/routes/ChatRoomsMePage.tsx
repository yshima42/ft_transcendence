import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChatRoomList } from 'features/chat/components/organisms/ChatRoomList';

export const ChatRoomsMePage: React.FC = React.memo(() => {
  const chatRoomLinkUrl = (chatRoomId: string) =>
    `/app/chat/rooms/${chatRoomId}`;
  const chatRoomEndpoint = '/chat/rooms/me';

  return (
    <>
      <ContentLayout title="My Chat">
        <C.Divider />
        <ChatRoomList
          chatRoomEndpoint={chatRoomEndpoint}
          chatRoomLinkUrl={chatRoomLinkUrl}
        />
      </ContentLayout>
    </>
  );
});
