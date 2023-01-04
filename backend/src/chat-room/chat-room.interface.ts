import { ChatRoomStatus } from '@prisma/client';

export type ResponseChatRoom = {
  id: string;
  name: string;
  roomStatus: ChatRoomStatus;
  chatMessages: Array<{
    content: string;
    createdAt: Date;
  }>;
};
