import { ChatRoomMemberStatus } from '@prisma/client';

export type ResponseChatRoomMember = {
  user: {
    id: string;
    nickname: string;
    avatarImageUrl: string;
  };
  memberStatus: ChatRoomMemberStatus;
};
