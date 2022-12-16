import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus, ChatRoomStatus } from '@prisma/client';
import { ResponseChatRoomMember } from 'features/chat/hooks/types';
import { axios } from 'lib/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChatRoomMemberActionTimeSetModal } from 'features/chat/components/organisms/ChatRoomMemberActionTimeSetModal';
import { ChatRoomMemberList } from 'features/chat/components/organisms/ChatRoomMemberList';
import { SecurityAccordionItem } from 'features/chat/components/organisms/SecurityAccordionItem';

type State = {
  chatRoomId: string;
  name: string;
  roomStatus: ChatRoomStatus;
};

type limit = '1m' | '1h' | '1d' | '1w' | '1M' | 'unlimited';

export const ChatRoomSettings: React.FC = React.memo(() => {
  const [loginUser, setLoginUser] = React.useState<ResponseChatRoomMember>();
  const [users, setUsers] = React.useState<ResponseChatRoomMember[]>([]);
  const [limit, setLimit] = React.useState<limit>('unlimited');
  const [selectedMemberStatus, setSelectedMemberStatus] =
    React.useState<ChatRoomMemberStatus>();
  const [selectedUserId, setSelectedUserId] = React.useState<string>();
  const [password, setPassword] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { chatRoomId, name, roomStatus } = location.state as State;
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  async function getLoginUser() {
    const res: { data: ResponseChatRoomMember } = await axios.get(
      `/chat/rooms/${chatRoomId}/users/me`
    );
    setLoginUser(res.data);
  }

  async function getAllUsers() {
    const res: { data: ResponseChatRoomMember[] } = await axios.get(
      `/chat/rooms/${chatRoomId}/users`
    );
    setUsers(res.data);
  }

  async function onClickUnLock() {
    await axios.patch(`/chat/rooms/${chatRoomId}`, {
      roomStatus: ChatRoomStatus.PUBLIC,
    });
    navigate(`/app/chat/rooms/${chatRoomId}`, {
      state: { chatRoomId, name, roomStatus: ChatRoomStatus.PUBLIC },
    });
  }

  async function onClickLock() {
    await axios.patch(`/chat/rooms/${chatRoomId}`, {
      password,
      roomStatus: ChatRoomStatus.PROTECTED,
    });
    navigate(`/app/chat/rooms/${chatRoomId}`, {
      state: { chatRoomId, name, roomStatus: ChatRoomStatus.PROTECTED },
    });
  }

  function setLimitAction(limit: limit) {
    setLimit(limit);
    onClose();
  }

  React.useEffect(() => {
    getAllUsers().catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    getLoginUser().catch((err) => console.log(err));
  }, [users]);

  async function onClickAction(
    userId: string,
    memberStatus: ChatRoomMemberStatus
  ) {
    // BANNED, MUTEDならモーダルを出す
    if (
      memberStatus === ChatRoomMemberStatus.BANNED ||
      memberStatus === ChatRoomMemberStatus.MUTED
    ) {
      setSelectedMemberStatus(memberStatus);
      setSelectedUserId(userId);
      setIsOpen(true);

      return;
    }
    await axios.patch(`/chat/rooms/${chatRoomId}/users/${userId}`, {
      memberStatus: memberStatus,
    });
    getAllUsers().catch((err) => console.log(err));
  }

  async function onClickLimitAction() {
    if (selectedUserId === undefined || selectedMemberStatus === undefined) {
      return;
    }
    await axios.patch(`/chat/rooms/${chatRoomId}/users/${selectedUserId}`, {
      memberStatus: selectedMemberStatus,
      limit,
    });
    getAllUsers().catch((err) => console.log(err));
  }

  React.useEffect(() => {
    onClickLimitAction().catch((err) => console.log(err));
  }, [limit]);

  async function exitChatRoom() {
    await axios.delete(`/chat/rooms/${chatRoomId}/users/me`);
    navigate('/app/chat/me');
  }

  async function onClickDeleteChatRoom() {
    await axios.delete(`/chat/rooms/${chatRoomId}`);
    navigate('/app/chat/me');
  }

  return (
    <>
      <ContentLayout title="Chat Room Settings">
        <C.Accordion allowToggle>
          <C.AccordionItem>
            <C.AccordionButton>
              <C.Box flex="1" textAlign="left">
                Users
              </C.Box>
              <C.AccordionIcon />
            </C.AccordionButton>
            <C.AccordionPanel pb={4}>
              {loginUser !== undefined && (
                <ChatRoomMemberList
                  loginUser={loginUser}
                  users={users}
                  onClickAction={onClickAction}
                />
              )}
            </C.AccordionPanel>
          </C.AccordionItem>
          {/* LoginUserがADMINならセキュリティタブを出す */}
          {loginUser !== undefined &&
            loginUser.memberStatus === ChatRoomMemberStatus.ADMIN && (
              <C.AccordionItem>
                <C.AccordionButton>
                  <C.Box flex="1" textAlign="left">
                    Security
                  </C.Box>
                  <C.AccordionIcon />
                </C.AccordionButton>
                <C.AccordionPanel pb={4}>
                  <SecurityAccordionItem
                    roomStatus={roomStatus}
                    lockFunc={async () => await onClickLock()}
                    unLockFunc={async () => await onClickUnLock()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                    }}
                  />
                </C.AccordionPanel>
              </C.AccordionItem>
            )}
        </C.Accordion>
        {/* 退出ボタン */}
        {/* ADMINには退出ボタンを表示しない */}
        {loginUser !== undefined &&
          loginUser.memberStatus !== ChatRoomMemberStatus.ADMIN && (
            <C.Button
              colorScheme="red"
              onClick={async () => await exitChatRoom()}
            >
              Exit
            </C.Button>
          )}
        {/* LoginUserがADMINなら消去ボタンを出す */}
        {loginUser !== undefined &&
          loginUser.memberStatus === ChatRoomMemberStatus.ADMIN && (
            <C.Button
              colorScheme="red"
              onClick={async () => await onClickDeleteChatRoom()}
            >
              Delete
            </C.Button>
          )}
      </ContentLayout>
      <ChatRoomMemberActionTimeSetModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={setLimitAction}
      />
    </>
  );
});
