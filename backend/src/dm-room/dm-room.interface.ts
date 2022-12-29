export type ResponseDmRoom = {
  id: string;
  dmRoomMembers: Array<{
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
