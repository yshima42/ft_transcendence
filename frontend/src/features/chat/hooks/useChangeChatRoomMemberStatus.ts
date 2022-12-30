import * as React from 'react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { LimitTime } from 'features/chat/types/chat';
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
  setSelectedLimitTime: React.Dispatch<
    React.SetStateAction<LimitTime | undefined>
  >;
} => {
  const [selectedLimitTime, setSelectedLimitTime] = React.useState<LimitTime>();
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
      selectedLimitTime as LimitTime
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
  };
};
