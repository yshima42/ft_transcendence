import { FC, memo } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { useLogout, useProfile } from 'hooks/api';
import { useNavigate } from 'react-router-dom';
import { LinkedNickname } from 'components/atoms/text/LinkedNickname';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';

export const UserNavigation: FC = memo(() => {
  const { logout, isLoading } = useLogout();
  const { user } = useProfile();

  const navigate = useNavigate();

  const onClickLogout = async () => {
    await logout({});
    navigate('/');
  };

  return (
    <Flex p="5%" mt={4} align="center">
      <UserAvatar
        id={user.id}
        size="sm"
        src={user.avatarImageUrl}
        data-test={'sidenav-user-avatar'}
      />
      <Flex flexDir="column" ml={4}>
        <LinkedNickname id={user.id} nickname={user.nickname} size="sm" />
        <Button
          size="xs"
          onClick={onClickLogout}
          color="gray"
          maxW={90}
          minW={90}
          isDisabled={isLoading}
        >
          Logout
        </Button>
      </Flex>
    </Flex>
  );
});
