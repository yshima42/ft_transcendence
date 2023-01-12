export type ResponseChatMessage = {
  id: string;
  createdAt: Date;
  content: string;
  sender: {
    id: string;
    nickname: string;
    avatarImageUrl: string;
  };
};
