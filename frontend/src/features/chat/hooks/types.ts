import { ChatUserStatus, ChatRoomStatus } from '@prisma/client';

export type ResponseChatRoomUser = {
  user: {
    id: string;
    nickname: string;
    avatarImageUrl: string;
  };
  status: ChatUserStatus;
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
  status: ChatRoomStatus;
  chatMessages: Array<{
    content: string;
    createdAt: Date;
  }>;
};
