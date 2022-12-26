import { ChatRoomMemberStatus, ChatRoomStatus } from '@prisma/client';

export type ResponseChatRoomMember = {
  user: {
    id: string;
    nickname: string;
    avatarImageUrl: string;
  };
  memberStatus: ChatRoomMemberStatus;
};

export type ResponseChatMessage = {
  id: string;
  createdAt: Date;
  content: string;
  sender: {
    id: string;
    name: string;
    avatarImageUrl: string;
  };
};

export type ResponseChatRoom = {
  id: string;
  name: string;
  roomStatus: ChatRoomStatus;
  chatMessages: Array<{
    content: string;
    createdAt: Date;
  }>;
};

export type Limit = '1m' | '1h' | '1d' | '1w' | '1M' | 'forever';
