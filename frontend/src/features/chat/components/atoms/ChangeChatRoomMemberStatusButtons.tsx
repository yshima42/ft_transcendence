import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { LimitTime, ResponseChatRoomMember } from 'features/chat/types/chat';
import * as SocketIOClient from 'socket.io-client';

const limitList: LimitTime[] = ['1m', '1h', '1d', '1w', '1M', 'forever'];

type Props = {
  chatRoomId: string;
  memberId: string;
  memberStatus: ChatRoomMemberStatus;
  chatLoginUser: ResponseChatRoomMember;
  socket: SocketIOClient.Socket;
};

export const changeChatRoomMemberStatusButtonTexts: {
  [key in ChatRoomMemberStatus]: string;
} = {
  ADMIN: '',
  MODERATOR: 'Demote',
  NORMAL: '',
  KICKED: 'Rejoin',
  BANNED: 'Unban',
  MUTED: 'Unmute',
};

export const ChangeChatRoomMemberStatusButtons: React.FC<Props> = React.memo(
  ({ chatRoomId, memberId, memberStatus, chatLoginUser, socket }) => {
    if (
      chatLoginUser.memberStatus !== ChatRoomMemberStatus.ADMIN &&
      chatLoginUser.memberStatus !== ChatRoomMemberStatus.MODERATOR
    ) {
      return null;
    }
    if (memberId === chatLoginUser.user.id) {
      return null;
    }
    let common: Array<{
      memberStatus: ChatRoomMemberStatus;
      label: string;
      hasLimitTime: boolean;
    }> = [
      {
        memberStatus: ChatRoomMemberStatus.KICKED,
        label: 'Kick',
        hasLimitTime: false,
      },
      {
        memberStatus: ChatRoomMemberStatus.BANNED,
        label: 'Ban',
        hasLimitTime: true,
      },
      {
        memberStatus: ChatRoomMemberStatus.MUTED,
        label: 'Mute',
        hasLimitTime: true,
      },
    ];
    if (chatLoginUser.memberStatus === ChatRoomMemberStatus.ADMIN) {
      switch (memberStatus) {
        case ChatRoomMemberStatus.ADMIN:
          return null;
        case ChatRoomMemberStatus.MODERATOR:
          common.push(
            {
              memberStatus: ChatRoomMemberStatus.NORMAL,
              label: 'Demote',
              hasLimitTime: false,
            },
            {
              memberStatus: ChatRoomMemberStatus.ADMIN,
              label: 'Appoint',
              hasLimitTime: false,
            }
          );
          break;
        case ChatRoomMemberStatus.NORMAL:
          common.push(
            {
              memberStatus: ChatRoomMemberStatus.MODERATOR,
              label: 'Promote',
              hasLimitTime: false,
            },
            {
              memberStatus: ChatRoomMemberStatus.ADMIN,
              label: 'Appoint',
              hasLimitTime: false,
            }
          );
          break;
        case ChatRoomMemberStatus.BANNED:
        case ChatRoomMemberStatus.MUTED:
          common = [
            {
              memberStatus: ChatRoomMemberStatus.NORMAL,
              label: changeChatRoomMemberStatusButtonTexts[memberStatus],
              hasLimitTime: false,
            },
          ];
          break;
      }
    } else if (chatLoginUser.memberStatus === ChatRoomMemberStatus.MODERATOR) {
      switch (memberStatus) {
        case ChatRoomMemberStatus.ADMIN:
          return null;
        case ChatRoomMemberStatus.MODERATOR:
          return null;
        case ChatRoomMemberStatus.NORMAL:
          break;
        case ChatRoomMemberStatus.BANNED:
        case ChatRoomMemberStatus.MUTED:
          common = [
            {
              memberStatus: ChatRoomMemberStatus.NORMAL,
              label: changeChatRoomMemberStatusButtonTexts[memberStatus],
              hasLimitTime: false,
            },
          ];
          break;
      }
    }

    return (
      <C.Flex>
        {common.map(({ memberStatus, label, hasLimitTime }) => (
          <C.Box key={memberStatus} mr={2}>
            {hasLimitTime ? (
              <ChatRoomMemberButtonWithLimitTime
                chatRoomId={chatRoomId}
                memberId={memberId}
                memberStatus={memberStatus}
                socket={socket}
                text={label}
              />
            ) : (
              <ChatRoomMemberButton
                chatRoomId={chatRoomId}
                memberId={memberId}
                memberStatus={memberStatus}
                socket={socket}
                text={label}
              />
            )}
          </C.Box>
        ))}
      </C.Flex>
    );
  }
);

const ChatRoomMemberButtonWithLimitTime: React.FC<{
  chatRoomId: string;
  memberId: string;
  memberStatus: ChatRoomMemberStatus;
  socket: SocketIOClient.Socket;
  text: string;
}> = React.memo(({ chatRoomId, memberId, memberStatus, socket, text }) => {
  function handleClick(limitTime: LimitTime) {
    socket.emit('changeChatRoomMemberStatusSocket', {
      chatRoomId,
      memberId,
      memberStatus,
      limitTime,
    });
  }

  return (
    <C.Popover>
      <C.PopoverTrigger>
        <C.Button>{text}</C.Button>
      </C.PopoverTrigger>
      <C.PopoverContent>
        <C.PopoverArrow />
        <C.PopoverCloseButton />
        <C.PopoverHeader>Choose ban time</C.PopoverHeader>
        <C.PopoverBody>
          {limitList.map((limitTime) => (
            <C.Button key={limitTime} onClick={() => handleClick(limitTime)}>
              {limitTime}
            </C.Button>
          ))}
        </C.PopoverBody>
      </C.PopoverContent>
    </C.Popover>
  );
});

const ChatRoomMemberButton: React.FC<{
  chatRoomId: string;
  memberId: string;
  memberStatus: ChatRoomMemberStatus;
  socket: SocketIOClient.Socket;
  text: string;
}> = React.memo(({ chatRoomId, memberId, memberStatus, socket, text }) => {
  function handleClick() {
    socket.emit('changeChatRoomMemberStatusSocket', {
      chatRoomId,
      memberId,
      memberStatus,
    });
  }

  return <C.Button onClick={handleClick}>{text}</C.Button>;
});
