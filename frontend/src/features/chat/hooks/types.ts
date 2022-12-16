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
