import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatUserStatus } from '@prisma/client';
import { ResponseChatRoomUser } from 'features/chat/hooks/types';
import {
  UserActionButtons,
  actionButtonTexts,
} from 'features/chat/components/atoms/UserActionButtons';

type Props = {
  loginUser: ResponseChatRoomUser;
  users: ResponseChatRoomUser[];
  onClickAction: (userId: string, status: ChatUserStatus) => Promise<void>;
};

export const ChatRoomUserList: React.FC<Props> = React.memo(
  ({ loginUser, users, onClickAction }) => {
    return (
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
                        {actionButtonTexts[user.status as ChatUserStatus]}
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
                        {actionButtonTexts[user.status as ChatUserStatus]}
                      </C.Button>
                    </C.Flex>
                  )}
              </C.Flex>
            </C.Flex>
          </C.ListItem>
        ))}
      </C.List>
    );
  }
);
