import * as React from 'react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { Limit } from 'features/chat/types/chat';
import { Socket } from 'socket.io-client';

export const useChangeChatRoomMemberStatus = (
  chatRoomId: string,
  socket: Socket
): {
  changeChatRoomMemberStatus: (
    memberId: string,
    memberStatus: ChatRoomMemberStatus
  ) => void;
  isOpen: boolean;
  onClose: () => void;
  setSelectedLimitTime: React.Dispatch<React.SetStateAction<Limit | undefined>>;
} => {
  const [selectedLimitTime, setSelectedLimitTime] = React.useState<Limit>();
  const [selectedMemberStatus, setSelectedMemberStatus] =
    React.useState<ChatRoomMemberStatus>();
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  React.useEffect(() => {
    if (selectedMemberId === undefined || selectedMemberStatus === undefined) {
      return;
    }
    selectLimitTime(
      selectedMemberId,
      selectedMemberStatus,
      selectedLimitTime as Limit
    );
    setIsOpen(false);
    setSelectedMemberId(undefined);
    setSelectedMemberStatus(undefined);
    setSelectedLimitTime(undefined);
  }, [selectedLimitTime]);

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
    selectedLimitTime: Limit
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
  };
};
