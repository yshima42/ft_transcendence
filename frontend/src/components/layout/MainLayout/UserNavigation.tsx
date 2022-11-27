import { FC, memo, useEffect } from 'react';
import { Avatar, AvatarBadge, Button, Flex, Heading } from '@chakra-ui/react';
import { useAuth } from 'features/auth/hooks/useAuth';
import { useMe } from 'hooks/useMe';
import { Link } from 'react-router-dom';

export const UserNavigation: FC = memo(() => {
  const { logout } = useAuth();

  const { getMe, me } = useMe();
  useEffect(() => getMe(), [getMe]);

  return (
    <Flex p="5%" mt={4} align="center">
      <Link to="/app/profile">
        <Avatar size="sm" src={me?.avatarUrl}>
          <AvatarBadge boxSize="1.1em" bg="green.500" />
        </Avatar>
      </Link>
      <Flex flexDir="column" ml={4}>
        <Link to="/app/profile">
          <Heading as="h3" size="sm">
            {me?.name}
          </Heading>
        </Link>
        <Button size="xs" rounded="lg" onClick={logout} color="gray">
          Logout
        </Button>
      </Flex>
    </Flex>
  );
});
