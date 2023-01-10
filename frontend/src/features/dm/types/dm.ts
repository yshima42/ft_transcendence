import { OnlineStatus } from '@prisma/client';

export type ResponseDmRoom = {
  id: string;
  dmRoomMembers: Array<{
    user: {
      id: string;
      nickname: string;
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
    id: string;
    nickname: string;
    avatarImageUrl: string;
    onlineStatus: OnlineStatus;
  };
};
