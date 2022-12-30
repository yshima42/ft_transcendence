import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus, ChatRoom } from '@prisma/client';
import {
  ResponseChatMessage,
  ResponseChatRoomMember,
  ResponseChatRoomMemberStatus,
} from 'features/chat/types/chat';
import { useBlockUsers } from 'hooks/api/block/useBlockUsers';
import { useGetApi2 } from 'hooks/api/generics/useGetApi2';
import { useSocket } from 'hooks/socket/useSocket';
import * as ReactRouter from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Message } from 'components/molecules/Message';
import { MessageSendForm } from 'components/molecules/MessageSendForm';

export const ChatRoomPage: React.FC = React.memo(() => {
  const { chatRoomId } = ReactRouter.useParams() as { chatRoomId: string };
  const { data: chatLoginUserData } = useGetApi2<ResponseChatRoomMember>(
    `/chat/rooms/${chatRoomId}/members/me`
  );
  useGetApi2<ResponseChatRoomMember>(`/chat/rooms/${chatRoomId}/members/me`);
  const { data: chatRoomData } = useGetApi2<ResponseChatRoomMemberStatus>(
    `/chat/rooms/${chatRoomId}`
  );
  const chatLoginUser = chatLoginUserData as ResponseChatRoomMember;
  const { name: chatName } = chatRoomData as ChatRoom;

  return (
    <>
      <ContentLayout title={chatName}>
        {/* チャットの設定ボタン */}
        <ChatRoomHeader chatRoomId={chatRoomId} />
        <C.Divider />
        <ChatRoomBody chatLoginUser={chatLoginUser} chatRoomId={chatRoomId} />
        <C.Divider />
        <ChatRoomFooter chatLoginUser={chatLoginUser} chatRoomId={chatRoomId} />
      </ContentLayout>
    </>
  );
});

const ChatRoomHeader: React.FC<{ chatRoomId: string }> = React.memo(
  ({ chatRoomId }) => {
    const url = (chatRoomId: string) =>
      `/app/chat/rooms/${chatRoomId}/settings`;

    return (
      <C.Flex justifyContent="flex-end" mb={4}>
        <C.Link as={ReactRouter.Link} to={url(chatRoomId)}>
          <C.Button colorScheme="blue">Settings</C.Button>
        </C.Link>
      </C.Flex>
    );
  }
);

const ChatRoomMutedAlert: React.FC = React.memo(() => {
  return (
    <C.Alert status="warning" mb={4}>
      <C.AlertIcon />
      You are muted.
    </C.Alert>
  );
});

const ChatRoomFooter: React.FC<{
  chatLoginUser: ResponseChatRoomMember;
  chatRoomId: string;
}> = React.memo(({ chatLoginUser, chatRoomId }) => {
  const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL, {
    autoConnect: false,
  });

  // 送信ボタンを押したときの処理
  function sendMessage(content: string): void {
    if (chatLoginUser == null) return;
    socket.emit('send_message', {
      chatRoomId,
      content,
    });
  }

  return (
    <>
      {/* メッセージ送信フォーム  loginUserがMUTEDのときは送信できないようにする */}
      {chatLoginUser.memberStatus === ChatRoomMemberStatus.MUTED ? (
        <ChatRoomMutedAlert />
      ) : (
        <MessageSendForm sendMessage={sendMessage} />
      )}
    </>
  );
});

const ChatRoomBody: React.FC<{
  chatLoginUser: ResponseChatRoomMember;
  chatRoomId: string;
}> = React.memo(({ chatLoginUser, chatRoomId }) => {
  const navigate = ReactRouter.useNavigate();
  const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL, {
    autoConnect: false,
  });
  const { data } = useGetApi2<ResponseChatMessage[]>(
    `/chat/rooms/${chatRoomId}/messages`
  );
  const scrollBottomRef = React.useRef<HTMLDivElement>(null);
  // ブロックユーザー
  const { users: blockUsers } = useBlockUsers();
  const [messages, setMessages] = React.useState<ResponseChatMessage[]>([]);

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
    socket.on(
      'changeChatRoomMemberStatusSocket',
      (responseChatRoomMemberStatus: ResponseChatRoomMemberStatus) => {
        if (responseChatRoomMemberStatus == null) return;
        if (
          responseChatRoomMemberStatus.memberId === chatLoginUser.user.id &&
          (responseChatRoomMemberStatus.memberStatus === 'BANNED' ||
            responseChatRoomMemberStatus.memberStatus === 'KICKED')
        ) {
          navigate('/app/chat/rooms/me');
        }
      }
    );

    return () => {
      // コンポーネントの寿命が切れるときに実行される
      socket.emit('leave_room_member', chatRoomId);
      socket.off();
    };
  }, [chatRoomId, socket]);

  // 更新時の自動スクロール
  React.useEffect(() => {
    scrollBottomRef.current?.scrollIntoView();
  }, [messages]);

  React.useEffect(() => {
    if (data == null) return;
    setMessages(data as ResponseChatMessage[]);
  }, [data]);

  return (
    <>
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
    </>
  );
});
