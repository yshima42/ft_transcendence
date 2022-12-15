import * as React from 'react';
import * as C from '@chakra-ui/react';
import { useAllChatRoom } from 'hooks/api/chat/useAllChatRoom';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const ChatRooms: React.FC = React.memo(() => {
  const { chatRooms } = useAllChatRoom();

  return (
    <>
      <ContentLayout title="Chat">
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
        <C.Divider />
        <C.List spacing={3} data-testid="chat-room-list">
          {chatRooms.map((chatRoom) => (
            <C.ListItem key={chatRoom.id} data-testid="chat-room-id">
              <C.Link
                as={Link}
                to={`room/${chatRoom.id}/confirmation`}
                state={{
                  chatRoomId: chatRoom.id,
                  name: chatRoom.name,
                  status: chatRoom.status,
                }}
              >
                <C.Box p={5} shadow="md" borderWidth="1px">
                  <C.Flex>
                    <C.Box>
                      <C.Text fontSize="sm">
                        {/* 投稿がない場合は何も表示しない */}
                        {chatRoom.chatMessages.length !== 0 ? (
                          new Date(
                            chatRoom.chatMessages[0].createdAt
                          ).toLocaleString()
                        ) : (
                          <></>
                        )}
                      </C.Text>
                      <C.Heading fontSize="xl">{`${chatRoom.name}`}</C.Heading>
                      {/* PROTECTED の場合 */}
                      <C.Text fontSize="sm">
                        {chatRoom.status === 'PROTECTED' ? (
                          <C.Badge colorScheme="red">PROTECTED</C.Badge>
                        ) : (
                          <></>
                        )}
                      </C.Text>
                    </C.Box>
                  </C.Flex>
                </C.Box>
              </C.Link>
            </C.ListItem>
          ))}
        </C.List>
      </ContentLayout>
    </>
  );
});
