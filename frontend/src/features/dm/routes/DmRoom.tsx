import * as React from 'react';
import * as C from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { axios } from 'lib/axios';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { MessageSendForm } from 'components/molecules/MessageSendForm';
import { DmMessages } from '../components/DmMessages';
import { ResponseDm } from '../types';

type State = {
  id: string;
};

export const DmRoom: React.FC = React.memo(() => {
  const { user } = useProfile();
  const location = useLocation();
  const { id: dmRoomId } = location.state as State;
  const [messages, setMessages] = React.useState<ResponseDm[]>([]);
  // TODO: ゲームとソケットを共有する
  const [socket] = React.useState<Socket>(io('http://localhost:3000'));
  const scrollBottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    socket.emit('join_room', dmRoomId);
    socket.on('receive_message', (payload: ResponseDm) => {
      setMessages((prev) => {
        return [...prev, payload];
      });
    });

    return () => {
      socket.off('join_room');
      socket.off('receive_message');
      socket.emit('leave_room', dmRoomId);
    };
  }, [dmRoomId, socket]);

  // 送信ボタンを押したときの処理
  function sendMessage(content: string): void {
    socket.emit('send_message', {
      content,
      senderId: user.id,
      dmRoomId,
    });
  }

  async function getAllDm(): Promise<void> {
    const res: { data: ResponseDm[] } = await axios.get(
      `/dm/message/${dmRoomId}`
    );
    setMessages(res.data);
  }

  React.useEffect(() => {
    getAllDm().catch((err) => console.error(err));
  }, []);

  // 更新時の自動スクロール
  React.useEffect(() => {
    scrollBottomRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <>
      <ContentLayout title="Direct Message">
        <C.Divider />
        <DmMessages messages={messages} scrollBottomRef={scrollBottomRef} />
        <C.Divider />
        <MessageSendForm onSubmit={sendMessage} />
      </ContentLayout>
    </>
  );
});
