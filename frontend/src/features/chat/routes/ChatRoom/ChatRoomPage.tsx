import * as React from 'react';
import { SettingsIcon } from '@chakra-ui/icons';
import * as C from '@chakra-ui/react';
import { ToastId } from '@chakra-ui/react';
import { ChatRoomMemberStatus, ChatRoom } from '@prisma/client';
import * as ReactQuery from '@tanstack/react-query';
import { useBanRedirect } from 'features/chat/hooks/useBanRedirect';
import {
  ResponseChatMessage,
  ResponseChatRoomMember,
  ResponseChatRoomMemberStatus,
} from 'features/chat/types/chat';
import { useBlockUsers } from 'hooks/api/block/useBlockUsers';
import { useGetApiOmitUndefined } from 'hooks/api/generics/useGetApi';
import { useSocket } from 'hooks/socket/useSocket';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import * as ReactRouter from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Message } from 'components/molecules/Message';
import { MessageSendForm } from 'components/molecules/MessageSendForm';

export const ChatRoomPage: React.FC = React.memo(() => {
  const { chatRoomId } = ReactRouter.useParams() as { chatRoomId: string };
  const chatLoginUserEndpoint = `/chat/rooms/${chatRoomId}/members/me`;
  const chatRoomInfoEndpoint = `/chat/rooms/${chatRoomId}`;
  const { data: chatLoginUser } =
    useGetApiOmitUndefined<ResponseChatRoomMember>(chatLoginUserEndpoint);
  const { data: chatRoom } =
    useGetApiOmitUndefined<ChatRoom>(chatRoomInfoEndpoint);
  const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL);
  useBanRedirect(chatLoginUser);

  return (
    <>
      <ContentLayout title={chatRoom.name}>
        {/* チャットの設定ボタン */}
        <ChatRoomHeader chatRoomId={chatRoomId} />
        <C.Divider />
        <ChatRoomBody
          chatLoginUser={chatLoginUser}
          chatRoomId={chatRoomId}
          socket={socket}
        />
        <C.Divider />
        <ChatRoomFooter
          chatLoginUser={chatLoginUser}
          chatRoomId={chatRoomId}
          socket={socket}
        />
      </ContentLayout>
    </>
  );
});

const ChatRoomHeader: React.FC<{ chatRoomId: string }> = React.memo(
  ({ chatRoomId }) => {
    const url = `/app/chat/rooms/${chatRoomId}/settings`;

    return (
      <C.Flex justifyContent="flex-end" mb={4}>
        <C.Link as={ReactRouter.Link} to={url}>
          <C.Icon as={SettingsIcon} size="xl" />
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
  socket: Socket;
}> = React.memo(({ chatLoginUser, chatRoomId, socket }) => {
  return (
    <>
      {/* メッセージ送信フォーム  loginUserがMUTEDのときは送信できないようにする */}
      {chatLoginUser.memberStatus === ChatRoomMemberStatus.MUTED ? (
        <ChatRoomMutedAlert />
      ) : (
        <MessageSendForm roomId={chatRoomId} socket={socket} />
      )}
    </>
  );
});

const ChatRoomBody: React.FC<{
  chatLoginUser: ResponseChatRoomMember;
  chatRoomId: string;
  socket: Socket;
}> = React.memo(({ chatLoginUser, chatRoomId, socket }) => {
  const navigate = ReactRouter.useNavigate();
  const myChatRoomsLink = '/app/chat/rooms/me';
  const endpoint = `/chat/rooms/${chatRoomId}/messages`;
  const { data: messages } =
    useGetApiOmitUndefined<ResponseChatMessage[]>(endpoint);
  const scrollBottomRef = React.useRef<HTMLDivElement>(null);
  const { users: blockUsers } = useBlockUsers();
  const queryClient = ReactQuery.useQueryClient();
  const { customToast } = useCustomToast();

  React.useEffect(() => {
    socket.emit('join_room_member', chatRoomId);
    socket.on('receive_message', (message: ResponseChatMessage) => {
      // メッセージを受け取ったときに実行される関数を登録
      if (blockUsers.some((user) => user.id === message.sender.id)) return;
      const queryKey = [endpoint];
      queryClient.setQueryData(
        queryKey,
        (oldData: ResponseChatMessage[] | undefined) => {
          if (oldData == null) return [message];

          return [...oldData, message];
        }
      );
    });
    // 例外の取得
    socket.on('exception', (data: { status: string; message: string }) => {
      const { message } = data;
      const id: ToastId = 'wsException';
      if (!customToast.isActive(id)) {
        customToast({ id, description: message });
      }
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
          navigate(myChatRoomsLink);
        }
      }
    );

    return () => {
      // コンポーネントの寿命が切れるときに実行される
      socket.emit('leave_room_member', chatRoomId);
      socket.off();
    };
  }, [chatRoomId, socket, blockUsers]);

  // 更新時の自動スクロール
  React.useEffect(() => {
    scrollBottomRef.current?.scrollIntoView();
  }, [messages]);

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
            userId={message.sender.id}
            nickname={message.sender.nickname}
            avatarImageUrl={message.sender.avatarImageUrl}
          />
        ))}
        <div ref={scrollBottomRef} />
      </C.Flex>
    </>
  );
});
