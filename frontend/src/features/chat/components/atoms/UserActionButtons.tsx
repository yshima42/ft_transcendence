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
    const Buttons: {
      [key in ChatUserStatus]: (userId: string) => React.ReactNode;
    } = {
      ADMIN: (userId: string) => (
        <>
          <C.Button
            onClick={() => onClickAction(userId, ChatUserStatus.KICKED)}
          >
            Kick
          </C.Button>
          <C.Button
            onClick={() => onClickAction(userId, ChatUserStatus.BANNED)}
          >
            Ban
          </C.Button>
          <C.Button onClick={() => onClickAction(userId, ChatUserStatus.MUTE)}>
            Mute
          </C.Button>
          <C.Button
            onClick={() => onClickAction(userId, ChatUserStatus.MODERATOR)}
          >
            Promote
          </C.Button>
          <C.Button onClick={() => onClickAction(userId, ChatUserStatus.ADMIN)}>
            Appoint
          </C.Button>
        </>
      ),
      MODERATOR: (userId: string) => (
        <>
          <C.Button
            onClick={() => onClickAction(userId, ChatUserStatus.KICKED)}
          >
            Kick
          </C.Button>
          <C.Button
            onClick={() => onClickAction(userId, ChatUserStatus.BANNED)}
          >
            Ban
          </C.Button>
          <C.Button onClick={() => onClickAction(userId, ChatUserStatus.MUTE)}>
            Mute
          </C.Button>
        </>
      ),
      NORMAL: () => <></>,
      KICKED: () => <></>,
      BANNED: () => <></>,
      MUTE: () => <></>,
    };

    return <>{Buttons[status](userId)}</>;
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
