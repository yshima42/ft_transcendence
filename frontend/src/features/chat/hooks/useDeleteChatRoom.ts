import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

export const useDeleteChatRoom = (
  chatRoomId: string,
  navigate: ReturnType<typeof useNavigate>
): {
  deleteChatRoom: () => Promise<void>;
} => {
  async function deleteChatRoom() {
    await axios.delete(`/chat/rooms/${chatRoomId}`);
    navigate('/app/chat/me');
  }

  return { deleteChatRoom };
};
