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
