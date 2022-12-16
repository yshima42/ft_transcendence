import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { ResponseChatRoomMember } from 'features/chat/hooks/types';
import {
  MemberActionButtons,
  actionButtonTexts,
} from 'features/chat/components/atoms/MemberActionButtons';

type Props = {
  loginUser: ResponseChatRoomMember;
  users: ResponseChatRoomMember[];
  onClickAction: (
    userId: string,
    memberStatus: ChatRoomMemberStatus
  ) => Promise<void>;
};

export const ChatRoomMemberList: React.FC<Props> = React.memo(
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
                <C.Text mr={5}>{user.memberStatus}</C.Text>
                {loginUser?.user.id === user.user.id && (
                  <C.Flex>
                    <C.Text mr={5}>me</C.Text>
                  </C.Flex>
                )}
                {/* userがLoginUserでない、かつ、(LoginUserがADMIN または MODERATOR) かつ、userがNORMALのとき */}
                {loginUser !== undefined &&
                  loginUser.user.id !== user.user.id &&
                  user.memberStatus === ChatRoomMemberStatus.NORMAL &&
                  (loginUser.memberStatus === ChatRoomMemberStatus.MODERATOR ||
                    loginUser.memberStatus === ChatRoomMemberStatus.ADMIN) && (
                    <C.Flex>
                      <MemberActionButtons
                        userId={user.user.id}
                        memberStatus={loginUser.memberStatus}
                        onClickAction={onClickAction}
                      />
                    </C.Flex>
                  )}
                {/* userがLoginUserでない、かつ、LoginUserがADMIN かつ、userがNORMALでないとき */}
                {loginUser !== undefined &&
                  loginUser.user.id !== user.user.id &&
                  loginUser.memberStatus === ChatRoomMemberStatus.ADMIN &&
                  user.memberStatus !== ChatRoomMemberStatus.ADMIN &&
                  user.memberStatus !== ChatRoomMemberStatus.NORMAL && (
                    <C.Flex>
                      <C.Button
                        onClick={async () =>
                          await onClickAction(
                            user.user.id,
                            ChatRoomMemberStatus.NORMAL
                          )
                        }
                      >
                        {
                          actionButtonTexts[
                            user.memberStatus as ChatRoomMemberStatus
                          ]
                        }
                      </C.Button>
                    </C.Flex>
                  )}
                {loginUser !== undefined &&
                  loginUser.user.id !== user.user.id &&
                  loginUser.memberStatus === ChatRoomMemberStatus.MODERATOR &&
                  user.memberStatus !== ChatRoomMemberStatus.MODERATOR &&
                  user.memberStatus !== ChatRoomMemberStatus.ADMIN &&
                  user.memberStatus !== ChatRoomMemberStatus.NORMAL && (
                    <C.Flex>
                      <C.Button
                        onClick={async () =>
                          await onClickAction(
                            user.user.id,
                            ChatRoomMemberStatus.NORMAL
                          )
                        }
                      >
                        {
                          actionButtonTexts[
                            user.memberStatus as ChatRoomMemberStatus
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
    );
  }
);
