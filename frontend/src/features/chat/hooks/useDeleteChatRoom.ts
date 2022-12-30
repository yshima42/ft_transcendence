import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

export const useDeleteChatRoom = (
  chatRoomId: string
): {
  deleteChatRoom: () => Promise<void>;
} => {
  const navigate = useNavigate();
  async function deleteChatRoom() {
    await axios.delete(`/chat/rooms/${chatRoomId}`);
    navigate('/app/chat/rooms/me');
  }

  return { deleteChatRoom };
};
