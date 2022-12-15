import * as React from 'react';
import * as C from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useSavedDms } from 'hooks/api/dm/useSavedDms';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { MessageSendForm } from 'components/molecules/MessageSendForm';
import { DmMessages } from '../components/DmMessages';
import { ResponseDm } from '../types';

type State = {
  dmRoomId: string;
};

export const DmRoom: React.FC = React.memo(() => {
  const { user } = useProfile();
  const location = useLocation();
  const { dmRoomId } = location.state as State;
  const { savedDms } = useSavedDms(dmRoomId);
  const [messages, setMessages] = React.useState<ResponseDm[]>(savedDms);
  // TODO: ソケットの生成、破棄をちゃんとやる
  const [socket] = React.useState<Socket>(io('http://localhost:3000/dm'));

  React.useEffect(() => {
    socket.emit('join_room', dmRoomId);
    socket.on('receive_message', (payload: ResponseDm) => {
      setMessages((prev) => {
        return [...prev, payload];
      });
    });

    return () => {
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

  return (
    <>
      <ContentLayout title="Direct Message">
        <C.Divider />
        <DmMessages messages={messages} />
        <C.Divider />
        <MessageSendForm onSubmit={sendMessage} />
      </ContentLayout>
    </>
  );
});
