import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { ResponseChatRoomMember } from 'features/chat/types/chat';
import {
  ChangeChatRoomMemberStatusButtons,
  changeChatRoomMemberStatusButtonTexts,
} from 'features/chat/components/atoms/ChangeChatRoomMemberStatusButtons';

type Props = {
  chatLoginUser: ResponseChatRoomMember;
  chatMembers: ResponseChatRoomMember[];
  changeChatRoomMemberStatus: (
    memberId: string,
    memberStatus: ChatRoomMemberStatus,
    chatLoginUser: ResponseChatRoomMember
  ) => void;
};

export const ChatRoomMemberList: React.FC<Props> = React.memo(
  ({ chatLoginUser, chatMembers, changeChatRoomMemberStatus }) => {
    return (
      <C.List spacing={3}>
        {chatMembers.map((user) => (
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
                {chatLoginUser?.user.id === user.user.id && (
                  <C.Flex>
                    <C.Text mr={5}>me</C.Text>
                  </C.Flex>
                )}
                {/* userがLoginUserでない、かつ、(LoginUserがADMIN または MODERATOR) かつ、userがNORMALのとき */}
                {chatLoginUser !== undefined &&
                  chatLoginUser.user.id !== user.user.id &&
                  user.memberStatus === ChatRoomMemberStatus.NORMAL &&
                  (chatLoginUser.memberStatus ===
                    ChatRoomMemberStatus.MODERATOR ||
                    chatLoginUser.memberStatus ===
                      ChatRoomMemberStatus.ADMIN) && (
                    <C.Flex>
                      <ChangeChatRoomMemberStatusButtons
                        userId={user.user.id}
                        memberStatus={chatLoginUser.memberStatus}
                        chatLoginUser={chatLoginUser}
                        changeChatRoomMemberStatus={changeChatRoomMemberStatus}
                      />
                    </C.Flex>
                  )}
                {/* userがLoginUserでない、かつ、LoginUserがADMIN かつ、userがNORMALでないとき */}
                {chatLoginUser !== undefined &&
                  chatLoginUser.user.id !== user.user.id &&
                  chatLoginUser.memberStatus === ChatRoomMemberStatus.ADMIN &&
                  user.memberStatus !== ChatRoomMemberStatus.ADMIN &&
                  user.memberStatus !== ChatRoomMemberStatus.NORMAL && (
                    <C.Flex>
                      <C.Button
                        onClick={() =>
                          changeChatRoomMemberStatus(
                            user.user.id,
                            ChatRoomMemberStatus.NORMAL,
                            chatLoginUser
                          )
                        }
                      >
                        {
                          changeChatRoomMemberStatusButtonTexts[
                            user.memberStatus as ChatRoomMemberStatus
                          ]
                        }
                      </C.Button>
                    </C.Flex>
                  )}
                {chatLoginUser !== undefined &&
                  chatLoginUser.user.id !== user.user.id &&
                  chatLoginUser.memberStatus ===
                    ChatRoomMemberStatus.MODERATOR &&
                  user.memberStatus !== ChatRoomMemberStatus.MODERATOR &&
                  user.memberStatus !== ChatRoomMemberStatus.ADMIN &&
                  user.memberStatus !== ChatRoomMemberStatus.NORMAL && (
                    <C.Flex>
                      <C.Button
                        onClick={() =>
                          changeChatRoomMemberStatus(
                            user.user.id,
                            ChatRoomMemberStatus.NORMAL,
                            chatLoginUser
                          )
                        }
                      >
                        {
                          changeChatRoomMemberStatusButtonTexts[
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
