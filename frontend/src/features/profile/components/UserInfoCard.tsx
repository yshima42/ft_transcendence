import { memo, FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { UserAvatarContainer } from 'components/organisms/avatar/UserAvatarContainer';
import { BlockButton } from './BlockButton';
import { ProfileSetting } from './ProfileSetting';

type UserInfoCardProps = {
  user: User;
  isLoginUser: boolean;
  isBlockedUser: boolean;
};

export const UserInfoCard: FC<UserInfoCardProps> = memo(
  ({ user, isLoginUser, isBlockedUser }: UserInfoCardProps) => {
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
        <UserAvatarContainer
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
        {isLoginUser && <ProfileSetting />}
        {isLoginUser || (
          <BlockButton userId={user.id} isBlockedUser={isBlockedUser} />
        )}
      </Flex>
    );
  }
);
