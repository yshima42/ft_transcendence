import { ChatRoomMemberStatus } from '@prisma/client';

export type ResponseChatRoomMember = {
  user: {
    id: string;
    nickname: string;
    avatarImageUrl: string;
  };
  memberStatus: ChatRoomMemberStatus;
};

export type LimitTime = '1m' | '1h' | '1d' | '1w' | '1M' | 'unlimited';
