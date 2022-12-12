import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus } from '@prisma/client';
import { axios } from 'lib/axios';
import { useLocation, Link } from 'react-router-dom';
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
  };
};

type State = {
  chatRoomId: string;
  name: string;
  status: ChatRoomStatus;
};

export const ChatRoom: React.FC = React.memo(() => {
  const location = useLocation();
  const { chatRoomId, name, status } = location.state as State;
  const [messages, setMessages] = React.useState<ResponseChatMessage[]>([]);

  async function getAllChatMessage(): Promise<void> {
    const res: { data: ResponseChatMessage[] } = await axios.get(
      `/chat/${chatRoomId}/message/all`
    );
    setMessages(res.data);
  }
  // 送信ボタンを押したときの処理
  async function sendMessage(content: string): Promise<void> {
    await axios.post(`/chat/${chatRoomId}/message`, { content });
    getAllChatMessage().catch((err) => console.error(err));
  }

  React.useEffect(() => {
    getAllChatMessage().catch((err) => console.error(err));
  }, []);

  return (
    <>
      <ContentLayout title={name}>
        {/* チャットの設定ボタン */}
        <C.Flex justifyContent="flex-end" mb={4}>
          <C.Link
            as={Link}
            to={`/app/chat/${chatRoomId}/settings`}
            state={{ chatRoomId, name, status }}
          >
            <C.Button colorScheme="blue">Settings</C.Button>
          </C.Link>
        </C.Flex>
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
