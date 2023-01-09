import { memo, FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useIsFriend } from 'hooks/api';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';
import { UserInfoCardButtons } from '../molecules/UserInfoCardButtons';

type Props = {
  user: User;
  isLoginUser: boolean;
};

export const UserInfoCard: FC<Props> = memo((props) => {
  const { user, isLoginUser } = props;
  const { isFriend } = useIsFriend(user.id);

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
      {isFriend || isLoginUser ? (
        <UserAvatar
          id={user.id}
          size="2xl"
          src={user.avatarImageUrl}
          data-test="profile-user-avatar"
        />
      ) : (
        <LinkedAvatar id={user.id} size="2xl" src={user.avatarImageUrl} />
      )}
      <Text
        fontSize="md"
        fontWeight="bold"
        pt="2"
        data-test={'profile-nickname'}
      >
        {user.nickname}
      </Text>
      <Text fontSize="xs" color="gray">
        {user.name}
      </Text>
      <UserInfoCardButtons user={user} isLoginUser={isLoginUser} />
    </Flex>
  );
});
