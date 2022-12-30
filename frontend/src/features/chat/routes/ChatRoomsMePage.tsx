import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ResponseChatRoom } from 'features/chat/types/chat';
import { useGetApi2 } from 'hooks/api/generics/useGetApi2';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { AlertModal } from 'features/chat/components/atoms/AlertModal';
import { Spinner } from 'features/chat/components/atoms/Spinner';
import { ChatRoomBox } from 'features/chat/components/organisms/ChatRoomBox';

export const ChatRoomsMePage: React.FC = React.memo(() => {
  const { data, isLoading, isError, error } =
    useGetApi2<ResponseChatRoom[]>('/chat/rooms/me');
  if (isLoading) return <Spinner />;
  if (isError) return <AlertModal error={error as Error} />;

  const chatRooms = data as ResponseChatRoom[];

  return (
    <>
      <ContentLayout title="My Chat">
        <C.Divider />
        <C.List spacing={3} data-testid="chat-room-list">
          {chatRooms.length === 0 && (
            <C.Center h="50vh">
              <C.Text textAlign="center">Chat Room is not found.</C.Text>
            </C.Center>
          )}
          {chatRooms.map((chatRoom) => (
            <C.ListItem key={chatRoom.id} data-testid="chat-room-id">
              <C.Link
                as={Link}
                to={`/app/chat/rooms/${chatRoom.id}`}
                state={{
                  chatRoomId: chatRoom.id,
                  chatName: chatRoom.name,
                  roomStatus: chatRoom.roomStatus,
                }}
              >
                <ChatRoomBox chatRoom={chatRoom} />
              </C.Link>
            </C.ListItem>
          ))}
        </C.List>
      </ContentLayout>
    </>
  );
});
