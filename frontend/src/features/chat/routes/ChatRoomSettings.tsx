import * as React from 'react';
import * as C from '@chakra-ui/react';
import { User, ChatUserStatus } from '@prisma/client';
import { axios } from 'lib/axios';
import { useLocation } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

type State = {
  chatRoomId: string;
};

type ResponseChatRoomUser = {
  user: {
    id: string;
    nickname: string;
    avatarImageUrl: string;
  };
  status: ChatUserStatus;
};

export const ChatRoomSettings: React.FC = React.memo(() => {
  const [loginUser, setLoginUser] = React.useState<ResponseChatRoomUser>();
  const [users, setUsers] = React.useState<ResponseChatRoomUser[]>([]);
  const location = useLocation();
  const { chatRoomId } = location.state as State;

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

  React.useEffect(() => {
    console.log('useEffect');
    getLoginUser().catch((err) => console.log(err));
  }, [users]);

  React.useEffect(() => {
    console.log('useEffect');
    getAllUsers().catch((err) => console.log(err));
  }, []);

  const UserActionButton: React.FC<{
    userId: string;
    status: ChatUserStatus;
    text: string;
  }> = ({ userId, status, text }) => {
    async function onClickAction(): Promise<void> {
      console.log('onClickAction');
      await axios.patch(`/chat/${chatRoomId}/user/${userId}`, {
        status,
      });
    }

    return (
      <>
        <C.Button colorScheme="red" onClick={onClickAction}>
          {text}
        </C.Button>
      </>
    );
  };

  const UserActionButtons: {
    [key in ChatUserStatus]: (userId: string) => React.ReactNode;
  } = {
    ADMIN: (userId: string) => (
      <>
        <UserActionButton
          userId={userId}
          status={ChatUserStatus.KICKED}
          text="Kick"
        />
        <UserActionButton
          userId={userId}
          status={ChatUserStatus.BANNED}
          text="Ban"
        />
        <C.Button colorScheme="red">Mute</C.Button>
        <C.Button colorScheme="red">Promote</C.Button>
        <C.Button colorScheme="red">Appoint</C.Button>
      </>
    ),
    MODERATOR: (userId: string) => (
      <>
        <UserActionButton
          userId={userId}
          status={ChatUserStatus.KICKED}
          text="Kick"
        />
        <C.Button colorScheme="red">Ban</C.Button>
        <C.Button colorScheme="red">Mute</C.Button>
      </>
    ),
    NORMAL: () => <></>,
    KICKED: () => <></>,
    BANNED: () => <></>,
    MUTE: () => <></>,
  };

  return (
    <>
      <ContentLayout title="Chat Room Setting">
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
                        {loginUser?.user.id !== user.user.id &&
                          (loginUser?.status === ChatUserStatus.MODERATOR ||
                            loginUser?.status === ChatUserStatus.ADMIN) && (
                            <C.Flex>
                              {UserActionButtons[loginUser.status](
                                user.user.id
                              )}
                            </C.Flex>
                          )}
                        {/* userがLoginUserでない、かつ、LoginUserがMODERATOR かつ、userがNORMALのとき */}
                      </C.Flex>
                    </C.Flex>
                  </C.ListItem>
                ))}
              </C.List>
            </C.AccordionPanel>
          </C.AccordionItem>
          <C.AccordionItem>
            <C.AccordionButton>
              <C.Box flex="1" textAlign="left">
                Security
              </C.Box>
              <C.AccordionIcon />
            </C.AccordionButton>
            <C.AccordionPanel pb={4}>
              <C.Text>Security</C.Text>
            </C.AccordionPanel>
          </C.AccordionItem>
        </C.Accordion>
        {/* 退出ボタン */}
        <C.Button colorScheme="red">Exit</C.Button>
      </ContentLayout>
    </>
  );
});
