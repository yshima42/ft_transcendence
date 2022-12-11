import { ChatRoomStatus } from '@prisma/client';

export type ResponseChatRoom = {
  id: string;
  name: string;
  status: ChatRoomStatus;
  chatMessages: Array<{
    content: string;
    createdAt: Date;
  }>;
};
