import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoom } from '@prisma/client';
import { AxiosError } from 'axios';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

// ボタンを押すと、作成したチャットルームに遷移する
export const CreateChatRooms: React.FC = React.memo(() => {
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  async function CreateChatRooms() {
    if (name === '') {
      alert('チャットルーム名を入力してください');

      return;
    }
    let chatRoom: ChatRoom;
    try {
      if (password === '') {
        const response = await axios.post<ChatRoom>('/chat/room', {
          name,
        });
        chatRoom = response.data;
      } else {
        const response = await axios.post<ChatRoom>('/chat/room', {
          name,
          password,
        });
        chatRoom = response.data;
      }
    } catch (e) {
      const error = e as AxiosError;
      // 409
      if (error.response?.status === 409) {
        alert('既に存在するチャットルーム名です');
      }

      return;
    }

    navigate(`/app/chat/${chatRoom.id}`, {
      state: { chatRoomId: chatRoom.id, name: chatRoom.name },
    });
  }

  return (
    <>
      <ContentLayout title="Create Chat Room">
        {/*
          From
            name: 必須
            password: 任意
        */}
        <C.Box>
          <C.Heading as="h2" size="md">
            チャットルームを作成する
          </C.Heading>
          <C.FormControl id="name">
            <C.FormLabel>チャットルーム名</C.FormLabel>
            <C.Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </C.FormControl>
          <C.FormControl id="password">
            <C.FormLabel>パスワード</C.FormLabel>
            <C.Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </C.FormControl>
          <C.Button onClick={CreateChatRooms}>作成</C.Button>
        </C.Box>
      </ContentLayout>
    </>
  );
});
