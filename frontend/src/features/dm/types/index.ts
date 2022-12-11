import { OnlineStatus } from '@prisma/client';

export type ResponseDm = {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    name: string;
    avatarImageUrl: string;
    onlineStatus: OnlineStatus;
  };
};
