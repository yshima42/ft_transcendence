import { OnlineStatus } from '@prisma/client';

export type ResponseChatMessage = {
  id: string;
  createdAt: Date;
  content: string;
  sender: {
    name: string;
    avatarImageUrl: string;
    onlineStatus: OnlineStatus;
  };
};
