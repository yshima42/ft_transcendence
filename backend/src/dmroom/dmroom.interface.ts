export type ResponseDmRoom = {
  id: string;
  dmUsers: Array<{
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
