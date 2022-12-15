import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus, ChatUserStatus } from '@prisma/client';
import {
  ResponseChatRoomUser,
  ResponseChatMessage,
} from 'hooks/api/chat/types';
import { axios } from 'lib/axios';
import { useLocation, Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Message } from 'components/molecules/Message';
import { MessageSendForm } from 'components/molecules/MessageSendForm';

type State = {
  chatRoomId: string;
  name: string;
  chatRoomStatus: ChatRoomStatus;
};

export const ChatRoom: React.FC = React.memo(() => {
  const location = useLocation();
  const { chatRoomId, name, chatRoomStatus } = location.state as State;
  const [messages, setMessages] = React.useState<ResponseChatMessage[]>([]);
  const [loginUser, setLoginUser] = React.useState<ResponseChatRoomUser>();

  async function getAllChatMessage(): Promise<void> {
    const res: { data: ResponseChatMessage[] } = await axios.get(
      `/chat/rooms/${chatRoomId}/messages`
    );
    setMessages(res.data);
  }
  // 送信ボタンを押したときの処理
  async function sendMessage(content: string): Promise<void> {
    await axios.post(`/chat/rooms/${chatRoomId}/messages`, { content });
    getAllChatMessage().catch((err) => console.error(err));
  }

  async function getLoginUser() {
    const res: { data: ResponseChatRoomUser } = await axios.get(
      `/chat/rooms/${chatRoomId}/users/me`
    );
    setLoginUser(res.data);
  }

  React.useEffect(() => {
    getAllChatMessage().catch((err) => console.error(err));
    getLoginUser().catch((err) => console.error(err));
  }, []);

  return (
    <>
      <ContentLayout title={name}>
        {/* チャットの設定ボタン */}
        <C.Flex justifyContent="flex-end" mb={4}>
          <C.Link
            as={Link}
            to={`/app/chat/rooms/${chatRoomId}/settings`}
            state={{ chatRoomId, name, chatRoomStatus }}
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
        {/* メッセージ送信フォーム  loginUserがMUTEのときは送信できないようにする */}
        {loginUser?.status === ChatUserStatus.MUTE && (
          <C.Alert status="warning" mb={4}>
            <C.AlertIcon />
            You are muted.
          </C.Alert>
        )}
        {loginUser?.status !== ChatUserStatus.MUTE && (
          <MessageSendForm onSubmit={sendMessage} />
        )}
      </ContentLayout>
    </>
  );
});
