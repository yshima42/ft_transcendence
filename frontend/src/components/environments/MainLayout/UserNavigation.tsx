import { FC, memo } from 'react';
import { AvatarBadge, Button, Flex, Heading } from '@chakra-ui/react';
import { useLogout, useProfile } from 'hooks/api';
import { Link, useNavigate } from 'react-router-dom';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

export const UserNavigation: FC = memo(() => {
  const { logout } = useLogout();
  const { user } = useProfile();

  const navigate = useNavigate();

  const onClickLogout = async () => {
    await logout({});
    navigate('/');
  };

  return (
    <Flex p="5%" mt={4} align="center">
      <LinkedAvatar size="sm" src={user.avatarImageUrl} linkUrl="/app/profile">
        <AvatarBadge boxSize="1.1em" bg="green.500" />
      </LinkedAvatar>
      <Flex flexDir="column" ml={4}>
        <Link to="/app/profile">
          <Heading as="h3" size="sm">
            {user.nickname}
          </Heading>
        </Link>
        <Button size="xs" rounded="lg" onClick={onClickLogout} color="gray">
          Logout
        </Button>
      </Flex>
    </Flex>
  );
});
