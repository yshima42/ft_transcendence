export type ResponseDmRoom = {
  id: string;
  dmRoomMembers: Array<{
    user: {
      id: string;
      name: string;
      avatarImageUrl: string;
    };
  }>;
  dms: Array<{
    content: string;
    createdAt: Date;
  }>;
};
