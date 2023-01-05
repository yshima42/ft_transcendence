import * as ReactQuery from '@tanstack/react-query';
import { useDeleteApi2 } from 'hooks/api/generics/useDeleteApi2';
import { useNavigate } from 'react-router-dom';

const useLeaveChatRoomSub = (
  chatRoomId: string,
  endpoint: (chatRoomId: string) => string
): {
  leaveChatRoom: () => void;
} => {
  const navigate = useNavigate();
  const navigateUrl = '/app/chat/rooms/me';
  const queryKeys: ReactQuery.QueryKey[] = [['/chat/rooms/me']];

  const { mutate } = useDeleteApi2(endpoint(chatRoomId), queryKeys);

  function leaveChatRoom() {
    mutate({}, { onSuccess: () => navigate(navigateUrl) });
  }

  return { leaveChatRoom };
};

export const useLeaveChatRoom = (
  chatRoomId: string
): {
  exitChatRoom: () => void;
  deleteChatRoom: () => void;
} => {
  const exitEndpoint = (chatRoomId: string) =>
    `/chat/rooms/${chatRoomId}/members/me`;
  const deleteEndpoint = (chatRoomId: string) => `/chat/rooms/${chatRoomId}`;
  const { leaveChatRoom: exitChatRoom } = useLeaveChatRoomSub(
    chatRoomId,
    exitEndpoint
  );
  const { leaveChatRoom: deleteChatRoom } = useLeaveChatRoomSub(
    chatRoomId,
    deleteEndpoint
  );

  return { exitChatRoom, deleteChatRoom };
};
