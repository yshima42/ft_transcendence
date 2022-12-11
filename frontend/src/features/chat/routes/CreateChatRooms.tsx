import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoom } from '@prisma/client';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

// ボタンを押すと、作成したチャットルームに遷移する
export const CreateChatRooms: React.FC = React.memo(() => {
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  async function CreateChatRooms() {
    const res = await axios.post('/chat/room', { name, password });
    const chatRoom = res.data as ChatRoom;
    // 作成したチャットルームに遷移する
    navigate(`/app/chat/${chatRoom.id}`, {
      state: { chatRoomId: chatRoom.id, name: chatRoom.name },
    });
  }

  return (
    <>
      <ContentLayout title="Create Chat Room">
        {/*
          name: 必須
          password: 任意
        */}
        <C.VStack>
          <C.Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <C.Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <C.Button onClick={CreateChatRooms} colorScheme="teal">
            Create Chat Room
          </C.Button>
        </C.VStack>
      </ContentLayout>
    </>
  );
});
