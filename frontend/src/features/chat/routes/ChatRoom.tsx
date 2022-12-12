import * as React from 'react';
import * as C from '@chakra-ui/react';
import { OnlineStatus } from '@prisma/client';
import { useProfile } from 'hooks/api';
import { axios } from 'lib/axios';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Message } from 'components/molecules/Message';
import { MessageSendForm } from 'components/molecules/MessageSendForm';

type ResponseChatMessage = {
  id: string;
  createdAt: Date;
  content: string;
  sender: {
    name: string;
    avatarImageUrl: string;
    onlineStatus: OnlineStatus;
  };
};

type State = {
  id: string;
};

export const ChatRoom: React.FC = React.memo(() => {
  const { user } = useProfile();
  const location = useLocation();
  const { id: chatRoomId } = location.state as State;
  const [messages, setMessages] = React.useState<ResponseChatMessage[]>([]);
  // TODO: ソケットの生成、破棄をちゃんとやる
  const [socket] = React.useState<Socket>(io('http://localhost:3000/chat'));
  const scrollBottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    socket.emit('join_room', chatRoomId);
    socket.on('receive_message', (payload: ResponseChatMessage) => {
      setMessages((prev) => {
        return [...prev, payload];
      });
    });

    return () => {
      socket.off('receive_message');
      socket.emit('leave_room', chatRoomId);
    };
  }, [chatRoomId, socket]);

  async function getAllChatMessage(): Promise<void> {
    const res: { data: ResponseChatMessage[] } = await axios.get(
      `/chat/message/${chatRoomId}`
    );
    setMessages(res.data);
  }
  // 送信ボタンを押したときの処理
  function sendMessage(content: string): void {
    socket.emit('send_message', {
      content,
      senderId: user.id,
      chatRoomId,
    });
  }

  React.useEffect(() => {
    getAllChatMessage().catch((err) => console.error(err));
  }, []);

  // 更新時の自動スクロール
  React.useEffect(() => {
    scrollBottomRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <>
      <ContentLayout title="Chat Room">
        <C.Divider />
        <C.Flex
          flexDir="column"
          alignItems="flex-start"
          padding={4}
          overflowY="auto"
          overflowX="hidden"
          height="70vh"
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
          <div ref={scrollBottomRef} />
        </C.Flex>
        <C.Divider />
        <MessageSendForm onSubmit={sendMessage} />
      </ContentLayout>
    </>
  );
});
