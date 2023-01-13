import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import { ResponseChatRoom } from 'features/chat/types/chat';
import { useGetApiOmitUndefined } from 'hooks/api/generics/useGetApi';
import { Link } from 'react-router-dom';

const ChatRoomBox: React.FC<{ chatRoom: ResponseChatRoom }> = React.memo(
  ({ chatRoom }) => (
    <C.Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      {/* 投稿がない場合は何も表示しない */}
      {chatRoom.chatMessages.length !== 0 && (
        <C.Text fontSize="sm" data-testid="chat-room-created-at">
          {new Date(chatRoom.chatMessages[0].createdAt).toLocaleString()}
        </C.Text>
      )}
      <C.Heading fontSize="xl">{`${chatRoom.name}`}</C.Heading>
      {/* PROTECTED の場合 */}
      {chatRoom.roomStatus === ChatRoomStatus.PROTECTED && (
        <C.Badge colorScheme="red" data-testid="chat-room-room-status">
          PROTECTED
        </C.Badge>
      )}
      {/* PRIVATE の場合
        TODO: なぜかベタ打ちでしか動かない。調査は後回し
      */}
      {chatRoom.roomStatus === 'PRIVATE' && (
        <C.Badge colorScheme="blue" data-testid="chat-room-room-status">
          PRIVATE
        </C.Badge>
      )}
    </C.Box>
  )
);

const ChatRoomListItem: React.FC<{
  chatRoom: ResponseChatRoom;
  chatRoomLinkUrl: (chatRoomId: string) => string;
}> = React.memo(({ chatRoom, chatRoomLinkUrl }) => {
  return (
    <C.ListItem key={chatRoom.id} data-testid="chat-room-id">
      <C.Link as={Link} to={chatRoomLinkUrl(chatRoom.id)}>
        <ChatRoomBox chatRoom={chatRoom} />
      </C.Link>
    </C.ListItem>
  );
});

export const ChatRoomList: React.FC<{
  chatRoomEndpoint: string;
  chatRoomLinkUrl: (chatRoomId: string) => string;
}> = React.memo(({ chatRoomEndpoint, chatRoomLinkUrl }) => {
  const { data: chatRooms } =
    useGetApiOmitUndefined<ResponseChatRoom[]>(chatRoomEndpoint);

  return (
    <C.List spacing={3} data-testid="chat-room-list">
      {chatRooms.length === 0 && (
        <C.Center h="50vh">
          <C.Text textAlign="center">Chat Room is not found.</C.Text>
        </C.Center>
      )}
      {chatRooms.map((chatRoom) => (
        <ChatRoomListItem
          key={chatRoom.id}
          chatRoom={chatRoom}
          chatRoomLinkUrl={chatRoomLinkUrl}
        />
      ))}
    </C.List>
  );
});
