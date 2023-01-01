import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

export const useExitChatRoom = (
  chatRoomId: string
): {
  exitChatRoom: () => Promise<void>;
} => {
  const navigate = useNavigate();
  const endpoint = (chatRoomId: string) =>
    `/chat/rooms/${chatRoomId}/members/me`;
  const navigateUrl = '/app/chat/rooms/me';

  async function exitChatRoom() {
    await axios.delete(endpoint(chatRoomId));
    navigate(navigateUrl);
  }

  return { exitChatRoom };
};
