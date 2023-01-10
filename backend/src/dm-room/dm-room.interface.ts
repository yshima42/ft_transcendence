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
