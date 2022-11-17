import { FC, memo, useEffect } from 'react';
import { Avatar, AvatarBadge, Button, Flex, Heading } from '@chakra-ui/react';
import axios from 'axios';
import { useMe } from 'hooks/useMe';
import { Link, useNavigate } from 'react-router-dom';

export const UserNavigation: FC = memo(() => {
  const navigate = useNavigate();

  const { getMe, me } = useMe();
  useEffect(() => getMe(), [getMe]);

  const onClickLogout = () => {
    const params = new URLSearchParams();
    axios
      .post('http://localhost:3000/auth/logout', params, {
        withCredentials: true,
      })
      .then(() => navigate('/'))
      .catch(() => alert('error'));
  };

  return (
    <Flex p="5%" mt={4} align="center">
      <Link to="/app/users/profile">
        <Avatar size="sm" src={me?.avatarUrl}>
          <AvatarBadge boxSize="1.1em" bg="green.500" />
        </Avatar>
      </Link>
      <Flex flexDir="column" ml={4}>
        <Link to="/app/users/profile">
          <Heading as="h3" size="sm">
            {me?.name}
          </Heading>
        </Link>
        <Button size="xs" rounded="lg" onClick={onClickLogout} color="gray">
          Logout
        </Button>
      </Flex>
    </Flex>
  );
});
