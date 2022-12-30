import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ResponseChatRoom } from 'features/chat/types/chat';

export const ChatRoomBox: React.FC<{ chatRoom: ResponseChatRoom }> = React.memo(
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
