import { FC, memo } from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { useLogout, useProfile } from 'hooks/api';
import { Link, useNavigate } from 'react-router-dom';
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
      <UserAvatar id={user.id} size="sm" src={user.avatarImageUrl} />
      <Flex flexDir="column" ml={4}>
        <Link to="/app/profile">
          <Heading as="h3" size="sm">
            {user.nickname}
          </Heading>
        </Link>
        <Button
          size="xs"
          rounded="lg"
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
