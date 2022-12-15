import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatUserStatus } from '@prisma/client';

type Props = {
  userId: string;
  status: ChatUserStatus;
  onClickAction: (userId: string, status: ChatUserStatus) => void;
};

export const UserActionButtons: React.FC<Props> = React.memo(
  ({ userId, status, onClickAction }) => {
    const isAdmin = status === ChatUserStatus.ADMIN;
    const isModerator = status === ChatUserStatus.MODERATOR;
    let buttons: React.ReactNode;

    if (isAdmin || isModerator) {
      const actionButtons: Array<{ status: ChatUserStatus; label: string }> = [
        {
          status: ChatUserStatus.KICKED,
          label: 'Kick',
        },
        {
          status: ChatUserStatus.BANNED,
          label: 'Ban',
        },
        {
          status: ChatUserStatus.MUTE,
          label: 'Mute',
        },
      ];

      if (isAdmin) {
        actionButtons.push(
          {
            status: ChatUserStatus.MODERATOR,
            label: 'Promote',
          },
          {
            status: ChatUserStatus.ADMIN,
            label: 'Appoint',
          }
        );
      }

      buttons = actionButtons.map(({ status, label }) => (
        <C.Button key={status} onClick={() => onClickAction(userId, status)}>
          {label}
        </C.Button>
      ));
    } else {
      buttons = <></>;
    }

    return <>{buttons}</>;
  }
);

export const actionButtonTexts: { [key in ChatUserStatus]: string } = {
  ADMIN: '',
  MODERATOR: 'Demote',
  NORMAL: '',
  KICKED: 'Rejoin',
  BANNED: 'Unban',
  MUTE: 'Unmute',
};
