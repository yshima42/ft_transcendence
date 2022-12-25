export type ResponseChatMessage = {
  id: string;
  createdAt: Date;
  content: string;
  sender: {
    id: string;
    name: string;
    avatarImageUrl: string;
  };
};
