import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { ResponseChatRoomMember } from 'features/chat/types/chat';

type Props = {
  userId: string;
  memberStatus: ChatRoomMemberStatus;
  chatLoginUser: ResponseChatRoomMember;
  changeChatRoomMemberStatus: (
    userId: string,
    memberStatus: ChatRoomMemberStatus,
    chatLoginUser: ResponseChatRoomMember
  ) => void;
};

export const ChangeChatRoomMemberStatusButtons: React.FC<Props> = React.memo(
  ({ userId, memberStatus, chatLoginUser, changeChatRoomMemberStatus }) => {
    const isAdmin = memberStatus === ChatRoomMemberStatus.ADMIN;
    const isModerator = memberStatus === ChatRoomMemberStatus.MODERATOR;
    let buttons: React.ReactNode;

    if (isAdmin || isModerator) {
      const actionButtons: Array<{
        memberStatus: ChatRoomMemberStatus;
        label: string;
      }> = [
        {
          memberStatus: ChatRoomMemberStatus.KICKED,
          label: 'Kick',
        },
        {
          memberStatus: ChatRoomMemberStatus.BANNED,
          label: 'Ban',
        },
        {
          memberStatus: ChatRoomMemberStatus.MUTED,
          label: 'Mute',
        },
      ];

      if (isAdmin) {
        actionButtons.push(
          {
            memberStatus: ChatRoomMemberStatus.MODERATOR,
            label: 'Promote',
          },
          {
            memberStatus: ChatRoomMemberStatus.ADMIN,
            label: 'Appoint',
          }
        );
      }

      buttons = actionButtons.map(({ memberStatus, label }) => (
        <C.Button
          key={memberStatus}
          onClick={() =>
            changeChatRoomMemberStatus(userId, memberStatus, chatLoginUser)
          }
        >
          {label}
        </C.Button>
      ));
    } else {
      buttons = <></>;
    }

    return <>{buttons}</>;
  }
);

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
