import * as React from 'react';
import * as C from '@chakra-ui/react';
import { axios } from 'lib/axios';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

type ResponseChatRoom = {
  id: string;
  name: string;
  chatMessages: Array<{
    content: string;
    createdAt: Date;
  }>;
};

// chatRoom一覧
//  chatRoom作成ボタン
export const ChatRooms: React.FC = React.memo(() => {
  const [chatRooms, setChatRooms] = React.useState<ResponseChatRoom[]>([]);

  async function getAllChatRoom(): Promise<void> {
    const res: { data: ResponseChatRoom[] } = await axios.get('/chat/room');
    setChatRooms(res.data);
  }

  React.useEffect(() => {
    getAllChatRoom().catch((err) => console.error(err));
  }, []);

  return (
    <>
      <ContentLayout title="Chat">
        <C.Flex justifyContent="flex-end" mb={4}>
          <C.Button colorScheme="blue" as={Link} to="create">
            {' '}
            Create Chat Room{' '}
          </C.Button>
        </C.Flex>
        <C.Divider />
        <C.List spacing={3}>
          {chatRooms.map((chatRoom) => (
            <C.ListItem key={chatRoom.id}>
              <C.Link
                as={Link}
                to={`${chatRoom.id}`}
                state={{ id: chatRoom.id }}
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
