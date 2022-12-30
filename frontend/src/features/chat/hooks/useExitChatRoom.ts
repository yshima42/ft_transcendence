import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

export const useExitChatRoom = (
  chatRoomId: string
): {
  exitChatRoom: () => Promise<void>;
} => {
  const navigate = useNavigate();
  async function exitChatRoom() {
    await axios.delete(`/chat/rooms/${chatRoomId}/members/me`);
    navigate('/app/chat/rooms/me');
  }

  return { exitChatRoom };
};
