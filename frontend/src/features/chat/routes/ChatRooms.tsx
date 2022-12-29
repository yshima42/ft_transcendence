import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ResponseChatRoom } from 'features/chat/types/chat';
import { useGetApi2 } from 'hooks/api/generics/useGetApi2';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

const CreateChatRoomButton: React.FC = React.memo(() => (
  <C.Button
    colorScheme="blue"
    as={Link}
    to="create"
    data-testid="create-chat-room"
  >
    Create Chat Room
  </C.Button>
));

const ChatRoomBox: React.FC<{ chatRoom: ResponseChatRoom }> = React.memo(
  ({ chatRoom }) => (
    <C.Box p={5} shadow="md" borderWidth="1px">
      {/* 投稿がない場合は何も表示しない */}
      {chatRoom.chatMessages.length !== 0 && (
        <C.Text fontSize="sm" data-testid="chat-room-created-at">
          {new Date(chatRoom.chatMessages[0].createdAt).toLocaleString()}
        </C.Text>
      )}
      <C.Heading fontSize="xl">{`${chatRoom.name}`}</C.Heading>
      {/* PROTECTED の場合 */}
      {chatRoom.roomStatus === 'PROTECTED' && (
        <C.Badge colorScheme="red" data-testid="chat-room-room-status">
          PROTECTED
        </C.Badge>
      )}
    </C.Box>
  )
);

const AlertModal: React.FC<{ error: Error }> = React.memo(({ error }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const onClose = () => setIsOpen(false);

  return (
    <C.Modal isOpen={isOpen} onClose={onClose} isCentered>
      <C.ModalOverlay />
      <C.ModalContent>
        <C.ModalHeader>エラー</C.ModalHeader>
        <C.ModalCloseButton />
        <C.ModalBody>{error.message}</C.ModalBody>
        <C.ModalFooter>
          <C.Button colorScheme="blue" mr={3} onClick={onClose}>
            閉じる
          </C.Button>
        </C.ModalFooter>
      </C.ModalContent>
    </C.Modal>
  );
});

const ChatRoomList: React.FC = React.memo(() => {
  const { data, isLoading, isError, error } =
    useGetApi2<ResponseChatRoom[]>('/chat/rooms');
  if (isLoading) {
    return (
      <C.Center h="50vh">
        <C.Spinner />
      </C.Center>
    );
  }
  if (isError) {
    return <AlertModal error={error as Error} />;
  }

  const chatRooms = data as ResponseChatRoom[];

  return (
    <C.List spacing={3} data-testid="chat-room-list">
      {chatRooms.map((chatRoom) => (
        <C.ListItem key={chatRoom.id} data-testid="chat-room-id">
          <C.Link
            as={Link}
            to={`${chatRoom.id}/confirmation`}
            state={{
              chatRoomId: chatRoom.id,
              chatName: chatRoom.name,
              rootStatus: chatRoom.roomStatus,
            }}
          >
            <ChatRoomBox chatRoom={chatRoom} />
          </C.Link>
        </C.ListItem>
      ))}
    </C.List>
  );
});

export const ChatRooms: React.FC = React.memo(() => {
  return (
    <>
      <ContentLayout title="Chat">
        <C.Flex justifyContent="flex-end" mb={4}>
          <CreateChatRoomButton />
        </C.Flex>
        <C.Divider />
        <ChatRoomList />
      </ContentLayout>
    </>
  );
});
