import { memo, FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';
import { UserInfoCardButtons } from '../molecules/UserInfoCardButtons';

type Props = {
  user: User;
  isLoginUser: boolean;
};

export const UserInfoCard: FC<Props> = memo((props) => {
  const { user, isLoginUser } = props;

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
        dataTestProp={'profile-user-avatar'}
      />
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
