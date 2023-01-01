import * as React from 'react';
import * as C from '@chakra-ui/react';
import { useChangeChatRoomMemberStatus } from 'features/chat/hooks/useChangeChatRoomMemberStatus';
import { ResponseChatRoomMember } from 'features/chat/types/chat';
import * as SocketIOClient from 'socket.io-client';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';
import { ChangeChatRoomMemberStatusButtons } from 'features/chat/components/atoms/ChangeChatRoomMemberStatusButtons';

type Props = {
  chatRoomId: string;
  chatLoginUser: ResponseChatRoomMember;
};

export const ChatRoomMemberList: React.FC<Props> = React.memo(
  ({ chatRoomId, chatLoginUser }) => {
    const { chatMembers, socket } = useChangeChatRoomMemberStatus(chatRoomId);

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
}> = React.memo(({ chatRoomId, member, chatLoginUser, socket }) => {
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
          chatLoginUserStatus={chatLoginUser.memberStatus}
          socket={socket}
        />
      </C.Flex>
    </C.ListItem>
  );
});
