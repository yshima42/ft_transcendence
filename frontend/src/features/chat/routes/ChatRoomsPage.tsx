import * as React from 'react';
import * as C from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChatRoomList } from 'features/chat/components/organisms/ChatRoomList';

export const ChatRoomsPage: React.FC = React.memo(() => {
  const chatRoomLinkUrl = (chatRoomId: string) => `${chatRoomId}/confirmation`;
  const chatRoomEndpoint = '/chat/rooms';

  return (
    <>
      <ContentLayout title="Chat">
        <ChatRoomsHeader />
        <C.Divider />
        <ChatRoomList
          chatRoomEndpoint={chatRoomEndpoint}
          chatRoomLinkUrl={chatRoomLinkUrl}
        />
      </ContentLayout>
    </>
  );
});

const ChatRoomsHeader: React.FC = React.memo(() => (
  <C.Flex justifyContent="flex-end" mb={4}>
    <C.Button
      colorScheme="blue"
      as={Link}
      to="create"
      data-testid="create-chat-room"
    >
      Create Chat Room
    </C.Button>
  </C.Flex>
));
