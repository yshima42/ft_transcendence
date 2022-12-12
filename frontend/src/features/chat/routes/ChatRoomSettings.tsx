import * as React from 'react';
import * as C from '@chakra-ui/react';
import { User, ChatUserStatus, ChatRoomStatus } from '@prisma/client';
import { ResponseChatRoomUser } from 'features/chat/types';
import { axios } from 'lib/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import {
  UserActionButtons,
  actionButtonTexts,
} from 'features/chat/components/atoms/UserActionButtons';
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
    console.log('getLoginUser');
    console.log('chatRoomId: ' + chatRoomId);
    console.log('users: ' + JSON.stringify(users));
    const res: { data: User } = await axios.get('/users/me/profile');
    const loginUser = users.find((user) => user.user.id === res.data.id);
    setLoginUser(loginUser);
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

  // 画面読み込み前に
  React.useEffect(() => {
    console.log('useEffect');
    getLoginUser().catch((err) => console.log(err));
  }, [users]);

  React.useEffect(() => {
    console.log('useEffect');
    getAllUsers().catch((err) => console.log(err));
  }, []);

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
              <C.List spacing={3}>
                {users.map((user) => (
                  <C.ListItem key={user.user.id}>
                    <C.Flex>
                      <C.Avatar
                        size="sm"
                        name={user.user.nickname}
                        src={user.user.avatarImageUrl}
                      ></C.Avatar>
                      <C.Text ml={10}>{user.user.nickname}</C.Text>
                      <C.Spacer />
                      <C.Flex>
                        <C.Text mr={5}>{user.status}</C.Text>
                        {loginUser?.user.id === user.user.id && (
                          <C.Flex>
                            <C.Text mr={5}>me</C.Text>
                          </C.Flex>
                        )}
                        {/* userがLoginUserでない、かつ、(LoginUserがADMIN または MODERATOR) かつ、userがNORMALのとき */}
                        {loginUser !== undefined &&
                          loginUser.user.id !== user.user.id &&
                          user.status === ChatUserStatus.NORMAL &&
                          (loginUser.status === ChatUserStatus.MODERATOR ||
                            loginUser.status === ChatUserStatus.ADMIN) && (
                            <C.Flex>
                              <UserActionButtons
                                userId={user.user.id}
                                status={loginUser.status}
                                onClickAction={onClickAction}
                              />
                            </C.Flex>
                          )}
                        {/* userがLoginUserでない、かつ、LoginUserがADMIN かつ、userがNORMALでないとき */}
                        {loginUser !== undefined &&
                          loginUser.user.id !== user.user.id &&
                          loginUser.status === ChatUserStatus.ADMIN &&
                          user.status !== ChatUserStatus.ADMIN &&
                          user.status !== ChatUserStatus.NORMAL && (
                            <C.Flex>
                              <C.Button
                                onClick={async () =>
                                  await onClickAction(
                                    user.user.id,
                                    ChatUserStatus.NORMAL
                                  )
                                }
                              >
                                {
                                  actionButtonTexts[
                                    user.status as ChatUserStatus
                                  ]
                                }
                              </C.Button>
                            </C.Flex>
                          )}
                        {loginUser !== undefined &&
                          loginUser.user.id !== user.user.id &&
                          loginUser.status === ChatUserStatus.MODERATOR &&
                          user.status !== ChatUserStatus.MODERATOR &&
                          user.status !== ChatUserStatus.ADMIN &&
                          user.status !== ChatUserStatus.NORMAL && (
                            <C.Flex>
                              <C.Button
                                onClick={async () =>
                                  await onClickAction(
                                    user.user.id,
                                    ChatUserStatus.NORMAL
                                  )
                                }
                              >
                                {
                                  actionButtonTexts[
                                    user.status as ChatUserStatus
                                  ]
                                }
                              </C.Button>
                            </C.Flex>
                          )}
                      </C.Flex>
                    </C.Flex>
                  </C.ListItem>
                ))}
              </C.List>
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
