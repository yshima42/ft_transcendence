import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import { AxiosError } from 'axios';
import { axios } from 'lib/axios';
import * as RHF from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

type State = {
  chatRoomId: string;
  name: string;
  roomStatus: ChatRoomStatus;
};

export const ChatRoomConfirmation: React.FC = React.memo(() => {
  const location = useLocation();
  const { chatRoomId, name, roomStatus } = location.state as State;
  const navigate = useNavigate();
  const { handleSubmit, register } = RHF.useForm();
  // axiosを使って、チャットルームに参加する処理を行う。
  // その後、チャットルームのページに遷移する。
  async function joinChatRoom({ password }: { password: string }) {
    console.log(roomStatus);
    if (roomStatus === ChatRoomStatus.PROTECTED) {
      console.log('password', password);
      try {
        await axios.post(`/chat/rooms/${chatRoomId}/users`, {
          password,
        });
      } catch (e) {
        const err = e as AxiosError;
        console.log(err.response?.status);
        if (err.response?.status !== 201) {
          alert('認証に失敗しました。');
        }

        return;
      }
    } else {
      await axios.post(`/chat/rooms/${chatRoomId}/users`);
    }
    navigate(`/app/chat/rooms/${chatRoomId}`, {
      state: { chatRoomId, name, roomStatus },
    });
  }

  return (
    <ContentLayout title="Chat Room Confirmation">
      {/*
        statusがPUBLICの場合、 チャットルームへの参加確認
        statusがPROTECTEDの場合、 パスワードの要求

        チャットルームへの参加は、axiosを使って行う。
        チャットルームのページに遷移する。

        formは、react-hook-formを使って実装する。
      */}
      <C.Box>
        <C.Heading>チャットルームに参加</C.Heading>
        <form onSubmit={handleSubmit(joinChatRoom)}>
          <C.FormControl>
            <C.FormLabel>チャットルーム名</C.FormLabel>
            <C.Text>{name}</C.Text>
          </C.FormControl>
          {roomStatus === ChatRoomStatus.PROTECTED && (
            <C.FormControl>
              <C.FormLabel>パスワード</C.FormLabel>
              <C.Input
                placeholder="パスワード"
                type="password"
                {...register('password')}
              />
            </C.FormControl>
          )}
          <C.Button type="submit" colorScheme="teal" mt={4}>
            チャットルームに参加
          </C.Button>
        </form>
      </C.Box>
    </ContentLayout>
  );
});
