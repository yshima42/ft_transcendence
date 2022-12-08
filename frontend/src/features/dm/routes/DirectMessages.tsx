import * as React from 'react';
import * as C from '@chakra-ui/react';
import { OnlineStatus } from '@prisma/client';
import { axios } from 'lib/axios';
import { useLocation } from 'react-router-dom';
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

export const DirectMessages: React.FC = React.memo(() => {
  const location = useLocation();
  const { id: dmRoomId } = location.state as State;
  const [messages, setMessages] = React.useState<ResponseDm[]>([]);

  async function getAllDm(): Promise<void> {
    const res: { data: ResponseDm[] } = await axios.get(
      `/dm/message/${dmRoomId}`
    );
    setMessages(res.data);
  }
  // 送信ボタンを押したときの処理
  async function sendMessage(content: string): Promise<void> {
    await axios.post(`/dm/message/${dmRoomId}`, { content, dmRoomId });
    getAllDm().catch((err) => console.error(err));
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
