import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatUserStatus, ChatRoomStatus } from '@prisma/client';
import { ResponseChatRoomUser } from 'features/chat/types';
import { axios } from 'lib/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChatRoomUserList } from 'features/chat/components/organisms/ChatRoomUserList';
import { SecurityAccordionItem } from 'features/chat/components/organisms/SecurityAccordionItem';

type State = {
  chatRoomId: string;
  name: string;
  status: ChatRoomStatus;
};

export const ChatRoomSettings: React.FC = React.memo(() => {
  const [loginUser, setLoginUser] = React.useState<ResponseChatRoomUser>();
  const [users, setUsers] = React.useState<ResponseChatRoomUser[]>([]);
  const [password, setPassword] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { chatRoomId, name, status } = location.state as State;

  async function getLoginUser() {
    const res: { data: ResponseChatRoomUser } = await axios.get(
      `/chat/${chatRoomId}/user/me`
    );
    setLoginUser(res.data);
  }

  async function getAllUsers() {
    const res: { data: ResponseChatRoomUser[] } = await axios.get(
      `/chat/${chatRoomId}/user`
    );
    setUsers(res.data);
  }

  async function onClickUnLock() {
    await axios.patch(`/chat/room/${chatRoomId}`, {
      status: ChatRoomStatus.PUBLIC,
    });
    navigate(`/app/chat/${chatRoomId}`, {
      state: { chatRoomId, name, status: ChatRoomStatus.PUBLIC },
    });
  }

  async function onClickLock() {
    await axios.patch(`/chat/room/${chatRoomId}`, {
      password,
      status: ChatRoomStatus.PROTECTED,
    });
    navigate(`/app/chat/${chatRoomId}`, {
      state: { chatRoomId, name, status: ChatRoomStatus.PROTECTED },
    });
  }

  React.useEffect(() => {
    console.log('useEffect');
    getAllUsers().catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    console.log('useEffect');
    getLoginUser().catch((err) => console.log(err));
  }, [users]);

  async function onClickAction(userId: string, status: ChatUserStatus) {
    console.log('onClickAction');
    await axios.patch(`/chat/${chatRoomId}/user/${userId}`, {
      status,
    });
    getAllUsers().catch((err) => console.log(err));
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
              <SecurityAccordionItem
                status={status}
                lockFunc={async () => await onClickLock()}
                unLockFunc={async () => await onClickUnLock()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />
            )}
        </C.Accordion>
      </ContentLayout>
    </>
  );
});
