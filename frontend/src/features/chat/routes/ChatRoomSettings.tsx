import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatUserStatus, ChatRoomStatus } from '@prisma/client';
import { ResponseChatRoomUser } from 'features/chat/hooks/types';
import { axios } from 'lib/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChatRoomUserActionTimeSetModal } from 'features/chat/components/organisms/ChatRoomUserActionTimeSetModal';
import { ChatRoomUserList } from 'features/chat/components/organisms/ChatRoomUserList';
import { SecurityAccordionItem } from 'features/chat/components/organisms/SecurityAccordionItem';

type State = {
  chatRoomId: string;
  name: string;
  chatRoomStatus: ChatRoomStatus;
};

type limit = '1m' | '1h' | '1d' | '1w' | '1M' | 'unlimited';

export const ChatRoomSettings: React.FC = React.memo(() => {
  const [loginUser, setLoginUser] = React.useState<ResponseChatRoomUser>();
  const [users, setUsers] = React.useState<ResponseChatRoomUser[]>([]);
  const [limit, setLimit] = React.useState<limit>('unlimited');
  const [selectedStatus, setSelectedStatus] = React.useState<ChatUserStatus>();
  const [selectedUserId, setSelectedUserId] = React.useState<string>();
  const [password, setPassword] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { chatRoomId, name, chatRoomStatus } = location.state as State;
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  async function getLoginUser() {
    const res: { data: ResponseChatRoomUser } = await axios.get(
      `/chat/rooms/${chatRoomId}/users/me`
    );
    setLoginUser(res.data);
  }

  async function getAllUsers() {
    const res: { data: ResponseChatRoomUser[] } = await axios.get(
      `/chat/rooms/${chatRoomId}/users`
    );
    setUsers(res.data);
  }

  async function onClickUnLock() {
    await axios.patch(`/chat/rooms/${chatRoomId}`, {
      status: ChatRoomStatus.PUBLIC,
    });
    navigate(`/app/chat/rooms/${chatRoomId}`, {
      state: { chatRoomId, name, chatRoomStatus: ChatRoomStatus.PUBLIC },
    });
  }

  async function onClickLock() {
    await axios.patch(`/chat/rooms/${chatRoomId}`, {
      password,
      status: ChatRoomStatus.PROTECTED,
    });
    navigate(`/app/chat/rooms/${chatRoomId}`, {
      state: { chatRoomId, name, chatRoomStatus: ChatRoomStatus.PROTECTED },
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

  async function onClickAction(userId: string, chatUserStatus: ChatUserStatus) {
    // BANNED, MUTEならモーダルを出す
    if (
      chatUserStatus === ChatUserStatus.BANNED ||
      chatUserStatus === ChatUserStatus.MUTE
    ) {
      setSelectedStatus(chatUserStatus);
      setSelectedUserId(userId);
      setIsOpen(true);

      return;
    }
    await axios.patch(`/chat/rooms/${chatRoomId}/users/${userId}`, {
      status: chatUserStatus,
    });
    getAllUsers().catch((err) => console.log(err));
  }

  async function onClickLimitAction() {
    if (selectedUserId === undefined || selectedStatus === undefined) {
      return;
    }
    await axios.patch(`/chat/rooms/${chatRoomId}/users/${selectedUserId}`, {
      status: selectedStatus,
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
                <ChatRoomUserList
                  loginUser={loginUser}
                  users={users}
                  onClickAction={onClickAction}
                />
              )}
            </C.AccordionPanel>
          </C.AccordionItem>
          {/* LoginUserがADMINならセキュリティタブを出す */}
          {loginUser !== undefined &&
            loginUser.status === ChatUserStatus.ADMIN && (
              <C.AccordionItem>
                <C.AccordionButton>
                  <C.Box flex="1" textAlign="left">
                    Security
                  </C.Box>
                  <C.AccordionIcon />
                </C.AccordionButton>
                <C.AccordionPanel pb={4}>
                  <SecurityAccordionItem
                    chatRoomStatus={chatRoomStatus}
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
          loginUser.status !== ChatUserStatus.ADMIN && (
            <C.Button
              colorScheme="red"
              onClick={async () => await exitChatRoom()}
            >
              Exit
            </C.Button>
          )}
        {/* LoginUserがADMINなら消去ボタンを出す */}
        {loginUser !== undefined &&
          loginUser.status === ChatUserStatus.ADMIN && (
            <C.Button
              colorScheme="red"
              onClick={async () => await onClickDeleteChatRoom()}
            >
              Delete
            </C.Button>
          )}
      </ContentLayout>
      <ChatRoomUserActionTimeSetModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={setLimitAction}
      />
    </>
  );
});
