import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { ResponseChatRoomMember } from 'features/chat/types/chat';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';
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
        {chatMembers.map((member) => (
          <ChatRoomMemberListItem
            key={member.user.id}
            member={member}
            chatLoginUser={chatLoginUser}
            changeChatRoomMemberStatus={changeChatRoomMemberStatus}
          />
        ))}
      </C.List>
    );
  }
);

// ChatRoomMemberListItem
const ChatRoomMemberListItem: React.FC<{
  member: ResponseChatRoomMember;
  chatLoginUser: ResponseChatRoomMember;
  changeChatRoomMemberStatus: (
    memberId: string,
    memberStatus: ChatRoomMemberStatus,
    chatLoginUser: ResponseChatRoomMember
  ) => void;
}> = React.memo(({ member, chatLoginUser, changeChatRoomMemberStatus }) => {
  return (
    <C.ListItem key={member.user.id}>
      <C.Flex>
        <UserAvatar
          id={member.user.id}
          size="sm"
          name={member.user.nickname}
          src={member.user.avatarImageUrl}
        ></UserAvatar>
        <C.Text ml={10}>{member.user.nickname}</C.Text>
        <C.Spacer />
        <C.Flex>
          <C.Text mr={5}>{member.memberStatus}</C.Text>
          {chatLoginUser?.user.id === member.user.id && (
            <C.Flex>
              <C.Text mr={5}>me</C.Text>
            </C.Flex>
          )}
          {/* userがLoginUserでない、かつ、(LoginUserがADMIN または MODERATOR) かつ、userがNORMALのとき */}
          {chatLoginUser !== undefined &&
            chatLoginUser.user.id !== member.user.id &&
            member.memberStatus === ChatRoomMemberStatus.NORMAL &&
            (chatLoginUser.memberStatus === ChatRoomMemberStatus.MODERATOR ||
              chatLoginUser.memberStatus === ChatRoomMemberStatus.ADMIN) && (
              <C.Flex>
                <ChangeChatRoomMemberStatusButtons
                  userId={member.user.id}
                  memberStatus={chatLoginUser.memberStatus}
                  chatLoginUser={chatLoginUser}
                  changeChatRoomMemberStatus={changeChatRoomMemberStatus}
                />
              </C.Flex>
            )}
          {/* memberがLoginUserでない、かつ、LoginUserがADMIN かつ、userがNORMALでないとき */}
          {chatLoginUser !== undefined &&
            chatLoginUser.user.id !== member.user.id &&
            chatLoginUser.memberStatus === ChatRoomMemberStatus.ADMIN &&
            member.memberStatus !== ChatRoomMemberStatus.ADMIN &&
            member.memberStatus !== ChatRoomMemberStatus.NORMAL && (
              <C.Flex>
                <C.Button
                  onClick={() =>
                    changeChatRoomMemberStatus(
                      member.user.id,
                      ChatRoomMemberStatus.NORMAL,
                      chatLoginUser
                    )
                  }
                >
                  {
                    changeChatRoomMemberStatusButtonTexts[
                      member.memberStatus as ChatRoomMemberStatus
                    ]
                  }
                </C.Button>
              </C.Flex>
            )}
          {chatLoginUser !== undefined &&
            chatLoginUser.user.id !== member.user.id &&
            chatLoginUser.memberStatus === ChatRoomMemberStatus.MODERATOR &&
            member.memberStatus !== ChatRoomMemberStatus.MODERATOR &&
            member.memberStatus !== ChatRoomMemberStatus.ADMIN &&
            member.memberStatus !== ChatRoomMemberStatus.NORMAL && (
              <C.Flex>
                <C.Button
                  onClick={() =>
                    changeChatRoomMemberStatus(
                      member.user.id,
                      ChatRoomMemberStatus.NORMAL,
                      chatLoginUser
                    )
                  }
                >
                  {
                    changeChatRoomMemberStatusButtonTexts[
                      member.memberStatus as ChatRoomMemberStatus
                    ]
                  }
                </C.Button>
              </C.Flex>
            )}
        </C.Flex>
      </C.Flex>
    </C.ListItem>
  );
});
