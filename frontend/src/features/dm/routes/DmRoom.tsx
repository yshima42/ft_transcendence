import * as React from 'react';
import * as C from '@chakra-ui/react';
import { OnlineStatus } from '@prisma/client';
import { useProfile } from 'hooks/api';
import { axios } from 'lib/axios';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Message } from 'components/molecules/Message';
import { MessageSendForm } from 'components/molecules/MessageSendForm';

export type ResponseDm = {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    name: string;
    avatarImageUrl: string;
    onlineStatus: OnlineStatus;
  };
};

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
    const newMessage: ResponseDm = {
      id: uuidv4(),
      content,
      createdAt: new Date(),
      sender: {
        name: user.name,
        avatarImageUrl: user.avatarImageUrl,
        onlineStatus: OnlineStatus.ONLINE,
      },
    };
    setMessages([...messages, newMessage]);
    socket.emit('send_message', {
      message: newMessage,
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

  return (
    <>
      <ContentLayout title="Direct Message">
        <C.Divider />
        <C.Flex
          flexDir="column"
          alignItems="flex-start"
          padding={4}
          overflowY="auto"
          overflowX="hidden"
        >
          {messages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              content={message.content}
              createdAt={message.createdAt}
              name={message.sender.name}
              avatarImageUrl={message.sender.avatarImageUrl}
            />
          ))}
        </C.Flex>
        <C.Divider />
        <MessageSendForm onSubmit={sendMessage} />
      </ContentLayout>
    </>
  );
});
