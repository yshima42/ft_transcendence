import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus } from '@prisma/client';
import {
  ResponseChatRoomMember,
  ResponseChatRoomMemberStatus,
} from 'features/chat/types/chat';
import { useGetApiOmitUndefined } from 'hooks/api/generics/useGetApi';
import { useSocket } from 'hooks/socket/useSocket';
import * as ReactRouter from 'react-router-dom';
import * as SocketIOClient from 'socket.io-client';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';
import { ChangeChatRoomMemberStatusButtons } from 'features/chat/components/atoms/ChangeChatRoomMemberStatusButtons';

type Props = {
  chatRoomId: string;
  chatLoginUser: ResponseChatRoomMember;
};

export const ChatRoomMemberList: React.FC<Props> = React.memo(
  ({ chatRoomId, chatLoginUser }) => {
    const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL);
    const { data: chatMembers, refetch: refetchChatMembers } =
      useGetApiOmitUndefined<ResponseChatRoomMember[]>(
        `/chat/rooms/${chatRoomId}/members`
      );
    const navigate = ReactRouter.useNavigate();

    React.useEffect(() => {
      const fetchDate = async () => {
        try {
          await refetchChatMembers();
        } catch (err) {
          console.log(err);
        }
      };
      // webSocket
      socket.emit('join_room_member', chatRoomId);
      // webSocketのイベントを受け取る関数を登録
      socket.on(
        'changeChatRoomMemberStatusSocket',
        (responseChatRoomMemberStatus: ResponseChatRoomMemberStatus) => {
          if (responseChatRoomMemberStatus === undefined) {
            return;
          }
          if (responseChatRoomMemberStatus.memberId === chatLoginUser.user.id) {
            if (
              responseChatRoomMemberStatus.memberStatus ===
                ChatRoomMemberStatus.KICKED ||
              responseChatRoomMemberStatus.memberStatus ===
                ChatRoomMemberStatus.BANNED
            ) {
              navigate('/app/chat/rooms/me');
            }
            window.location.reload();
          } else if (
            responseChatRoomMemberStatus.memberStatus ===
            ChatRoomMemberStatus.ADMIN
          ) {
            window.location.reload();
          }
          fetchDate().catch((err) => console.log(err));
        }
      );

      return () => {
        socket.emit('leave_room_member', chatRoomId);
        socket.off('changeChatRoomMemberStatusSocket', fetchDate);
      };
    }, []);

    return (
      <>
        <C.List spacing={3}>
          {chatMembers.map((member) => (
            <ChatRoomMemberListItem
              key={member.user.id}
              member={member}
              chatLoginUser={chatLoginUser}
              chatRoomId={chatRoomId}
              socket={socket}
            />
          ))}
        </C.List>
      </>
    );
  }
);

// ChatRoomMemberListItem
const ChatRoomMemberListItem: React.FC<{
  chatRoomId: string;
  member: ResponseChatRoomMember;
  chatLoginUser: ResponseChatRoomMember;
  socket: SocketIOClient.Socket;
}> = ({ chatRoomId, member, chatLoginUser, socket }) => {
  return (
    <C.ListItem key={member.user.id}>
      <C.Flex>
        <UserAvatar
          id={member.user.id}
          size="sm"
          name={member.user.nickname}
          src={member.user.avatarImageUrl}
        ></UserAvatar>
        <C.Text ml={10}>{member.user.nickname}</C.Text>
        <C.Spacer />
        <C.Text mr={5}>{member.memberStatus}</C.Text>
        {chatLoginUser.user.id === member.user.id && (
          <C.Flex>
            <C.Text mr={5}>me</C.Text>
          </C.Flex>
        )}
        <ChangeChatRoomMemberStatusButtons
          chatRoomId={chatRoomId}
          memberId={member.user.id}
          memberStatus={member.memberStatus}
          chatLoginUser={chatLoginUser}
          socket={socket}
        />
      </C.Flex>
    </C.ListItem>
  );
};
