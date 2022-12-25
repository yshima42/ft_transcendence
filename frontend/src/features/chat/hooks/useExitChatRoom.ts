import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

export const useExitChatRoom = (
  chatRoomId: string,
  navigate: ReturnType<typeof useNavigate>
): {
  exitChatRoom: () => Promise<void>;
} => {
  async function exitChatRoom() {
    await axios.delete(`/chat/rooms/${chatRoomId}/members/me`);
    navigate('/app/chat/me');
  }

  return { exitChatRoom };
};
