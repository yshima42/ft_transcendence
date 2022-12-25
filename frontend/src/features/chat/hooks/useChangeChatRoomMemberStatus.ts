import * as React from 'react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { Limit } from 'features/chat/hooks/types';
import { Socket } from 'socket.io-client';

export const useChangeChatRoomMemberStatus = (
  chatRoomId: string,
  socket: Socket
): {
  selectLimitTime: (
    memberId: string,
    memberStatus: ChatRoomMemberStatus,
    limitTime: Limit
  ) => void;
  changeChatRoomMemberStatus: (
    memberId: string,
    memberStatus: ChatRoomMemberStatus
  ) => void;
  isOpen: boolean;
  onClose: () => void;
  setSelectedLimitTime: React.Dispatch<React.SetStateAction<Limit>>;
} => {
  const [selectedLimitTime, setSelectedLimitTime] =
    React.useState<Limit>('unlimited');
  const [selectedMemberStatus, setSelectedMemberStatus] =
    React.useState<ChatRoomMemberStatus>();
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  React.useEffect(() => {
    if (selectedMemberId === undefined || selectedMemberStatus === undefined) {
      return;
    }
    selectLimitTime(selectedMemberId, selectedMemberStatus, selectedLimitTime);
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
      userId: memberId,
      updateChatRoomMemberDto: { memberStatus, undefined },
    });
  }

  function selectLimitTime(
    selectedMemberId: string,
    selectedMemberStatus: ChatRoomMemberStatus,
    selectedLimitTime: Limit
  ) {
    socket.emit('changeChatRoomMemberStatusSocket', {
      chatRoomId,
      userId: selectedMemberId,
      updateChatRoomMemberDto: {
        memberStatus: selectedMemberStatus,
        limitTime: selectedLimitTime,
      },
    });
  }

  return {
    isOpen,
    onClose,
    changeChatRoomMemberStatus,
    setSelectedLimitTime,
  };
};
