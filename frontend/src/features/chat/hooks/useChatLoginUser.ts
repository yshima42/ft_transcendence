import * as React from 'react';
import { ResponseChatRoomMember } from 'features/chat/hooks/types';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

export const useChatLoginUser = (
  chatRoomId: string,
  navigate: ReturnType<typeof useNavigate>
): {
  chatLoginUser: ResponseChatRoomMember | undefined;
  getChatLoginUser: () => Promise<ResponseChatRoomMember | undefined>;
} => {
  const [chatLoginUser, setChatLoginUser] =
    React.useState<ResponseChatRoomMember>();

  async function getChatLoginUser() {
    try {
      const res: { data: ResponseChatRoomMember } = await axios.get(
        `/chat/rooms/${chatRoomId}/members/me`
      );
      if (res.data.memberStatus === 'BANNED') {
        navigate('/app/chat/me');

        return;
      }
      setChatLoginUser(res.data);

      return res.data;
    } catch (e) {
      navigate('/app/chat/me');
    }
  }

  return { chatLoginUser, getChatLoginUser };
};
