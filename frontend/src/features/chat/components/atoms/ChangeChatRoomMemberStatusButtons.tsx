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
  OWNER: '',
  MODERATOR: 'Demote',
  NORMAL: '',
  KICKED: 'Rejoin',
  BANNED: 'Unban',
  MUTED: 'Unmute',
};

const buttonObject = (
  memberStatus: ChatRoomMemberStatus,
  label: string,
  hasLimitTime: boolean
) => {
  return {
    memberStatus,
    label,
    hasLimitTime,
  };
};

export const ChangeChatRoomMemberStatusButtons: React.FC<Props> = React.memo(
  ({ chatRoomId, memberId, memberStatus, chatLoginUser, socket }) => {
    if (
      chatLoginUser.memberStatus !== ChatRoomMemberStatus.OWNER &&
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
      buttonObject(ChatRoomMemberStatus.KICKED, 'Kick', false),
      buttonObject(ChatRoomMemberStatus.BANNED, 'Ban', true),
      buttonObject(ChatRoomMemberStatus.MUTED, 'Mute', true),
    ];
    if (chatLoginUser.memberStatus === ChatRoomMemberStatus.OWNER) {
      switch (memberStatus) {
        case ChatRoomMemberStatus.OWNER:
          return null;
        case ChatRoomMemberStatus.MODERATOR:
          common.push(
            buttonObject(ChatRoomMemberStatus.NORMAL, 'Demote', false),
            buttonObject(ChatRoomMemberStatus.OWNER, 'Appoint', false)
          );
          break;
        case ChatRoomMemberStatus.NORMAL:
          common.push(
            buttonObject(ChatRoomMemberStatus.MODERATOR, 'Promote', false),
            buttonObject(ChatRoomMemberStatus.OWNER, 'Appoint', false)
          );
          break;
        case ChatRoomMemberStatus.BANNED:
        case ChatRoomMemberStatus.MUTED:
          common = [
            buttonObject(
              ChatRoomMemberStatus.NORMAL,
              changeChatRoomMemberStatusButtonTexts[memberStatus],
              false
            ),
          ];
          break;
      }
    } else if (chatLoginUser.memberStatus === ChatRoomMemberStatus.MODERATOR) {
      switch (memberStatus) {
        case ChatRoomMemberStatus.OWNER:
          return null;
        case ChatRoomMemberStatus.MODERATOR:
          return null;
        case ChatRoomMemberStatus.NORMAL:
          break;
        case ChatRoomMemberStatus.BANNED:
        case ChatRoomMemberStatus.MUTED:
          common = [
            buttonObject(
              ChatRoomMemberStatus.NORMAL,
              changeChatRoomMemberStatusButtonTexts[memberStatus],
              false
            ),
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
        <C.PopoverHeader>Choose a limit time</C.PopoverHeader>
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
