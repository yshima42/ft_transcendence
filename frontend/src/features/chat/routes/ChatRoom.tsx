import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomStatus, ChatRoomMemberStatus } from '@prisma/client';
import { useChatLoginUser } from 'features/chat/hooks/useChatLoginUser';
import { ResponseChatMessage } from 'features/chat/types/chat';
import { useBlockUsers } from 'hooks/api/block/useBlockUsers';
import { useSocket } from 'hooks/socket/useSocket';
import { axios } from 'lib/axios';
import * as ReactRouter from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Message } from 'components/molecules/Message';
import { MessageSendForm } from 'components/molecules/MessageSendForm';

type State = {
  chatRoomId: string;
  chatName: string;
  roomStatus: ChatRoomStatus;
};

export const ChatRoom: React.FC = React.memo(() => {
  const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL, {
    autoConnect: false,
  });
  const location = ReactRouter.useLocation();
  const { chatRoomId, chatName } = location.state as State;
  const [messages, setMessages] = React.useState<ResponseChatMessage[]>([]);
  const { chatLoginUser, getChatLoginUser } = useChatLoginUser(chatRoomId);
  const scrollBottomRef = React.useRef<HTMLDivElement>(null);

  // ブロックユーザー
  const { users: blockUsers } = useBlockUsers();

  React.useEffect(() => {
    socket.emit('join_room_member', chatRoomId);
    socket.on('receive_message', (message: ResponseChatMessage) => {
      // メッセージを受け取ったときに実行される関数を登録
      if (blockUsers.some((user) => user.id === message.sender.id)) return;
      setMessages((prev) => {
        return [...prev, message];
      });
    });
    // webSocketのイベントを受け取る関数を登録
    socket.on('changeChatRoomMemberStatusSocket', () => {
      getChatLoginUser().catch((err) => console.log(err));
    });

    return () => {
      // コンポーネントの寿命が切れるときに実行される
      socket.emit('leave_room_member', chatRoomId);
      socket.off();
    };
  }, [chatRoomId, socket]);

  async function getAllChatMessage(): Promise<void> {
    const res: { data: ResponseChatMessage[] } = await axios.get(
      `/chat/rooms/${chatRoomId}/messages`
    );
    setMessages(res.data);
  }
  // 送信ボタンを押したときの処理
  function sendMessage(content: string): void {
    if (chatLoginUser == null) return;
    socket.emit('send_message', {
      createChatMessageDto: { content },
      chatRoomId,
    });
  }

  React.useEffect(() => {
    getAllChatMessage().catch((err) => console.error(err));
    getChatLoginUser().catch((err) => console.error(err));
  }, []);

  // 更新時の自動スクロール
  React.useEffect(() => {
    scrollBottomRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <>
      <ContentLayout title={chatName}>
        {/* チャットの設定ボタン */}
        <ChatRoomHeader />
        <C.Divider />
        <C.Flex
          flexDir="column"
          alignItems="flex-start"
          padding={4}
          overflowY="auto"
          overflowX="hidden"
          height="70vh"
        >
          {/* ブロックユーザーのメッセージは表示しない */}
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
        {/* メッセージ送信フォーム  loginUserがMUTEDのときは送信できないようにする */}
        {chatLoginUser == null ? null : chatLoginUser.memberStatus ===
          ChatRoomMemberStatus.MUTED ? (
          <C.Alert status="warning" mb={4}>
            <C.AlertIcon />
            You are muted.
          </C.Alert>
        ) : (
          <MessageSendForm sendMessage={sendMessage} />
        )}
      </ContentLayout>
    </>
  );
});

const ChatRoomHeader: React.FC = React.memo(() => {
  const location = ReactRouter.useLocation();
  const { chatRoomId, chatName, roomStatus } = location.state as State;

  return (
    <C.Flex justifyContent="flex-end" mb={4}>
      <C.Link
        as={ReactRouter.Link}
        to={`/app/chat/rooms/${chatRoomId}/settings`}
        state={{ chatRoomId, chatName, roomStatus }}
      >
        <C.Button colorScheme="blue">Settings</C.Button>
      </C.Link>
    </C.Flex>
  );
});
