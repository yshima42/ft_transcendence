export type ResponseChatRoom = {
  id: string;
  name: string;
  chatMessages: Array<{
    content: string;
    createdAt: Date;
  }>;
};
