import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoom } from '@prisma/client';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

// ボタンを押すと、作成したチャットルームに遷移する
export const CreateChatRooms: React.FC = React.memo(() => {
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  async function CreateChatRooms() {
    const res = await axios.post('/chat/room', { name });
    const chatRoom = res.data as ChatRoom;
    // 作成したチャットルームに遷移する
    navigate(`/app/chat/${chatRoom.id}`, {
      state: { chatRoomId: chatRoom.id, name: chatRoom.name },
    });
  }

  return (
    <>
      <ContentLayout title="Create Chat Room">
        <C.Flex justifyContent="center" alignItems="center" h="100vh">
          <C.Box p={5} shadow="md" borderWidth="1px">
            <C.Flex>
              <C.Box>
                <C.Text fontSize="sm">Create Chat Room</C.Text>
                <C.Heading fontSize="xl">{`Chat Room Name`}</C.Heading>
                <C.Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <C.Button colorScheme="blue" onClick={CreateChatRooms}>
                  Create
                </C.Button>
              </C.Box>
            </C.Flex>
          </C.Box>
        </C.Flex>
      </ContentLayout>
    </>
  );
});
