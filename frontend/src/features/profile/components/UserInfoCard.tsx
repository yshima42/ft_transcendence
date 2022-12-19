import { memo, FC } from 'react';
import { Flex, HStack, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';
import { BlockButton } from './BlockButton';
import { FriendButton } from './FriendButton';
import { GameButton } from './GameButton';
import { ProfileSetting } from './ProfileSetting';

type UserInfoCardProps = {
  user: User;
  isLoginUser: boolean;
};

export const UserInfoCard: FC<UserInfoCardProps> = memo(
  ({ user, isLoginUser }: UserInfoCardProps) => {
    return (
      <Flex
        w="100%"
        h="100%"
        bg="gray.200"
        borderRadius="20px"
        shadow="md"
        p={3}
        pt={5}
        direction="column"
        align="center"
      >
        <UserAvatar
          id={user.id}
          name={user.nickname}
          size="2xl"
          src={user.avatarImageUrl}
        />
        <Text fontSize="md" fontWeight="bold" pt="2">
          {user.nickname}
        </Text>
        <Text fontSize="xs" color="gray">
          {user.name}
        </Text>
        {isLoginUser ? (
          <ProfileSetting />
        ) : (
          <>
            <GameButton isGamePlaying={false} />
            <HStack justify="center" align="center">
              <FriendButton userId={user.id} />
              <BlockButton userId={user.id} />
            </HStack>
          </>
        )}
      </Flex>
    );
  }
);
