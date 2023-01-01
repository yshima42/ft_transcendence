import * as React from 'react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { LimitTime ,
  ResponseChatMessage,
  ResponseChatRoomMember,
} from 'features/chat/types/chat';
import { useGetApi2 } from 'hooks/api/generics/useGetApi2';
import { useSocket } from 'hooks/socket/useSocket';

export const useChangeChatRoomMemberStatus = (
  chatRoomId: string
): {
  changeChatRoomMemberStatus: (
    memberId: string,
    memberStatus: ChatRoomMemberStatus
  ) => void;
  isOpen: boolean;
  onClose: () => void;
  setSelectedLimitTime: React.Dispatch<
    React.SetStateAction<LimitTime | undefined>
  >;
  chatMembers: ResponseChatRoomMember[];
} => {
  const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL);
  const [selectedLimitTime, setSelectedLimitTime] = React.useState<LimitTime>();
  const [selectedMemberStatus, setSelectedMemberStatus] =
    React.useState<ChatRoomMemberStatus>();
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const { data: chatMembersData, refetch: refetchChatMembers } = useGetApi2<
    ResponseChatMessage[]
  >(`/chat/rooms/${chatRoomId}/members`);

  const chatMembers = chatMembersData as ResponseChatRoomMember[];

  React.useEffect(() => {
    if (selectedMemberId === undefined || selectedMemberStatus === undefined) {
      return;
    }
    selectLimitTime(
      selectedMemberId,
      selectedMemberStatus,
      selectedLimitTime as LimitTime
    );
    setIsOpen(false);
    setSelectedMemberId(undefined);
    setSelectedMemberStatus(undefined);
    setSelectedLimitTime(undefined);
  }, [selectedLimitTime]);

  React.useEffect(() => {
    const fetchDate = async () => {
      try {
        await refetchChatMembers();
      } catch (err) {
        console.log(err);
      }
    };
    // webSocket
    socket.emit('join_room_member', chatRoomId);
    // webSocketのイベントを受け取る関数を登録
    socket.on('changeChatRoomMemberStatusSocket', fetchDate);

    return () => {
      socket.emit('leave_room_member', chatRoomId);
      socket.off('changeChatRoomMemberStatusSocket', fetchDate);
    };
  }, []);

  function changeChatRoomMemberStatus(
    memberId: string,
    memberStatus: ChatRoomMemberStatus
  ) {
    // BANNED, MUTEDならモーダルを出す
    if (
      memberStatus === ChatRoomMemberStatus.BANNED ||
      memberStatus === ChatRoomMemberStatus.MUTED
    ) {
      setSelectedMemberStatus(memberStatus);
      setSelectedMemberId(memberId);
      setIsOpen(true);

      return;
    }
    socket.emit('changeChatRoomMemberStatusSocket', {
      chatRoomId,
      memberId,
      memberStatus,
    });
  }

  function selectLimitTime(
    selectedMemberId: string,
    selectedMemberStatus: ChatRoomMemberStatus,
    selectedLimitTime: LimitTime
  ) {
    socket.emit('changeChatRoomMemberStatusSocket', {
      chatRoomId,
      memberId: selectedMemberId,
      memberStatus: selectedMemberStatus,
      limitTime: selectedLimitTime,
    });
  }

  return {
    changeChatRoomMemberStatus,
    isOpen,
    onClose,
    setSelectedLimitTime,
    chatMembers,
  };
};
