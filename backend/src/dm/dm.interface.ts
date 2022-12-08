import { OnlineStatus } from '@prisma/client';

export type ResponseDmRoom = {
  id: string;
  dmRoomUsers: Array<{
    user: {
      name: string;
      avatarImageUrl: string;
    };
  }>;
  dms: Array<{
    content: string;
    createdAt: Date;
  }>;
};

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
