import * as React from 'react';
import * as C from '@chakra-ui/react';
import { OnlineStatus } from '@prisma/client';
import { axios } from 'lib/axios';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { id: chatRoomId } = location.state as State;
  const [messages, setMessages] = React.useState<ResponseChatMessage[]>([]);

  async function getAllChatMessage(): Promise<void> {
    const res: { data: ResponseChatMessage[] } = await axios.get(
      `/chat/message/${chatRoomId}`
    );
    setMessages(res.data);
  }
  // 送信ボタンを押したときの処理
  async function sendMessage(content: string): Promise<void> {
    await axios.post(`/chat/message`, { content, chatRoomId });
    getAllChatMessage().catch((err) => console.error(err));
  }

  React.useEffect(() => {
    getAllChatMessage().catch((err) => console.error(err));
  }, []);

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
