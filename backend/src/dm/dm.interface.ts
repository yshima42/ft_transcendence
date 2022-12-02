import { OnlineStatus } from '@prisma/client';

export type ResponseDmRoom = {
  id: string;
  dmUsers: Array<{
    user: {
      name: string;
      avatarImageUrl: string;
    };
  }>;
  dmMessages: Array<{
    content: string;
    createdAt: Date;
  }>;
};

export type ResponseDmMessage = {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    name: string;
    avatarImageUrl: string;
    onlineStatus: OnlineStatus;
  };
};
