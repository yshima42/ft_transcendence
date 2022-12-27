import * as React from 'react';
import * as C from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useSavedDms } from 'hooks/api/dm/useSavedDms';
import { useSocket } from 'hooks/socket/useSocket';
import { useLocation } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { MessageSendForm } from 'components/molecules/MessageSendForm';
import { DmMessages } from '../components/DmMessages';
import { ResponseDm } from '../types/dm';

type State = {
  dmRoomId: string;
};

export const DmRoom: React.FC = React.memo(() => {
  const { user } = useProfile();
  const location = useLocation();
  const { dmRoomId } = location.state as State;
  const { savedDms } = useSavedDms(dmRoomId);
  const [messages, setMessages] = React.useState<ResponseDm[]>(savedDms);
  const socket = useSocket(import.meta.env.VITE_WS_DM_URL, {
    autoConnect: false,
  });

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
        <MessageSendForm sendMessage={sendMessage} />
      </ContentLayout>
    </>
  );
});
