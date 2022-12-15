import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import { axios } from 'lib/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

type State = {
  chatRoomId: string;
  name: string;
  status: ChatRoomStatus;
};

export const ChatRoomConfirmation: React.FC = React.memo(() => {
  const location = useLocation();
  const { chatRoomId, name, status } = location.state as State;
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  // axiosを使って、チャットルームに参加する処理を行う。
  // その後、チャットルームのページに遷移する。
  async function joinChatRoom() {
    if (status === ChatRoomStatus.PROTECTED) {
      const res = await axios.post(`/chat/room/${chatRoomId}/user`, {
        password,
      });
      if (res.status === 201) {
        navigate(`/app/chat/room/${chatRoomId}`, {
          state: { chatRoomId, name },
        });
      } else {
        alert('パスワードが違います。');
      }
    } else {
      await axios.post(`/chat/room/${chatRoomId}/user`);
      navigate(`/app/chat/room/${chatRoomId}`, {
        state: { chatRoomId, name, status },
      });
    }
  }

  return (
    <ContentLayout title="Chat Room Confirmation">
      {/*
        statusがPUBLICの場合、 チャットルームへの参加確認
        statusがPROTECTEDの場合、 パスワードの要求
      */}
      <C.Text>チャットルーム名：{name}</C.Text>
      {status === ChatRoomStatus.PUBLIC ? (
        <C.Text>チャットルームへ参加しますか？</C.Text>
      ) : (
        <C.Text>パスワードを入力してください。</C.Text>
      )}
      {status === ChatRoomStatus.PROTECTED && (
        <C.Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}
      <C.Button onClick={joinChatRoom}>参加</C.Button>
    </ContentLayout>
  );
});
