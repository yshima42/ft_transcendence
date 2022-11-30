import { memo, FC } from 'react';
import { Avatar, Button, Flex, Spacer, Tag, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

export const UserInfoCard: FC = memo(() => {
  const { user } = useProfile();
  const navigate = useNavigate();

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
      <Avatar size="2xl" name={user.nickname} src={user.avatarUrl} />
      <Text fontSize="md" fontWeight="bold" pt="2">
        {user.nickname}
      </Text>
      <Text fontSize="xs" color="gray">
        {user.name}
      </Text>
      <Flex mt="2">
        <Text fontSize="sm">Two-Factor</Text>
        <Tag size="sm" variant="outline" colorScheme="green" ml="2">
          ON
        </Tag>
      </Flex>
      <Spacer />
      <Button size="xs" onClick={() => navigate('/app/profile/edit')}>
        Edit
      </Button>
    </Flex>
  );
});