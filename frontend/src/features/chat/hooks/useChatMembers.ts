import * as React from 'react';
import { ResponseChatRoomMember } from 'features/chat/types/chat';
import { axios } from 'lib/axios';

export const useChatMembers = (
  chatRoomId: string
): {
  chatMembers: ResponseChatRoomMember[] | undefined;
  getChatMembers: () => Promise<void>;
} => {
  const [chatMembers, setChatMembers] =
    React.useState<ResponseChatRoomMember[]>();

  async function getChatMembers() {
    const res: { data: ResponseChatRoomMember[] } = await axios.get(
      `/chat/rooms/${chatRoomId}/members`
    );
    setChatMembers(res.data);
  }

  return { chatMembers, getChatMembers };
};
