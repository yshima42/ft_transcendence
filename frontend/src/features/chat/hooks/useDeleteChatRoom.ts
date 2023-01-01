import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

export const useDeleteChatRoom = (
  chatRoomId: string
): {
  deleteChatRoom: () => Promise<void>;
} => {
  const navigate = useNavigate();
  const endpoint = (chatRoomId: string) => `/chat/rooms/${chatRoomId}`;
  const navigateUrl = '/app/chat/rooms/me';

  async function deleteChatRoom() {
    await axios.delete(endpoint(chatRoomId));
    navigate(navigateUrl);
  }

  return { deleteChatRoom };
};
