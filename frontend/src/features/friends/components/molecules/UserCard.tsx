import { FC, memo, ReactNode } from 'react';
import { Box, Flex, Avatar, Text, Spacer, Heading } from '@chakra-ui/react';

type Props = {
  username: string;
  nickname: string;
  avatarImageUrl: string;
  totalNumOfGames: number;
  winRate: number;
  buttons?: ReactNode;
};

export const UserCard: FC<Props> = memo((props) => {
  const {
    username,
    nickname,
    avatarImageUrl,
    totalNumOfGames,
    winRate,
    buttons,
  } = props;

  return (
    <Box p={4} bg="white" borderRadius="md" shadow="md">
      <Flex align="center">
        <Flex align="center" mr={2}>
          <Avatar
            size="lg"
            name={nickname}
            src={avatarImageUrl}
            mr={4}
            bg="white"
          />
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {nickname}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {username}
            </Text>
          </Box>
        </Flex>
        <Spacer />
        {buttons}
      </Flex>
      <Flex align="center" mt={4}>
        <Flex align="center" mr={2}>
          <Heading size="sm">Win Rate</Heading>
          <Box ml={4}>
            <Text fontSize="lg" fontWeight="bold">
              {winRate}%
            </Text>
          </Box>
        </Flex>
        <Spacer />
        <Flex align="center" mr={2}>
          <Heading size="sm">Total Games</Heading>
          <Box ml={4}>
            <Text fontSize="lg" fontWeight="bold">
              {totalNumOfGames}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
});
