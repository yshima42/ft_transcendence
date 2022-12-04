import { memo, FC } from 'react';
import { Avatar, Flex, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
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
        <Avatar size="2xl" name={user.nickname} src={user.avatarImageUrl} />
        <Text fontSize="md" fontWeight="bold" pt="2">
          {user.nickname}
        </Text>
        <Text fontSize="xs" color="gray">
          {user.name}
        </Text>
        {isLoginUser && <ProfileSetting />}
      </Flex>
    );
  }
);
