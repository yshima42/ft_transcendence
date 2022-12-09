import { ChatUserStatus } from '@prisma/client';

export type ResponseChatRoomUser = {
  user: {
    id: string;
    nickname: string;
    avatarImageUrl: string;
  };
  status: ChatUserStatus;
};
