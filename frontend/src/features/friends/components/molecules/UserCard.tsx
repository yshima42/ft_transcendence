import { FC, memo, ReactNode } from 'react';
import { Box, Flex, Text, Spacer } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';

type Props = {
  id: string;
  username: string;
  nickname: string;
  avatarImageUrl: string;
  buttons?: ReactNode;
  isFriend: boolean;
};

export const UserCard: FC<Props> = memo((props) => {
  const { id, username, nickname, avatarImageUrl, buttons, isFriend } = props;

  return (
    <Box
      p={4}
      bg="white"
      borderRadius="md"
      shadow="md"
      data-test={'user-card-' + nickname}
    >
      <Flex align="center">
        <Flex align="center" mr={2}>
          <Box w="60px">
            {isFriend ? (
              <UserAvatar
                id={id}
                size="md"
                src={avatarImageUrl}
                data-test={'users-user-avatar-' + nickname}
              />
            ) : (
              <LinkedAvatar
                id={id}
                size="md"
                src={avatarImageUrl}
                data-test={'users-user-avatar-' + nickname}
              />
            )}
          </Box>
          <Box>
            <Link to={`/app/users/${id}`}>
              <Text
                maxWidth="200px"
                noOfLines={1}
                fontSize="lg"
                fontWeight="bold"
              >
                {nickname}
              </Text>
            </Link>
            <Text maxWidth="200px" noOfLines={1} fontSize="sm" color="gray.500">
              {username}
            </Text>
          </Box>
        </Flex>
        <Spacer />
        {buttons}
      </Flex>
    </Box>
  );
});
