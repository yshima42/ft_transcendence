import { FC, memo, ReactNode } from 'react';
import { Box, Flex, Text, Spacer, Heading } from '@chakra-ui/react';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

// TODO:Propsとしてuserを渡せると、LinkedAvaterで遷移する先のプロフィールページでAPIをたたかずに済む。
// 余裕があれば対応したい
type Props = {
  id: string;
  username: string;
  nickname: string;
  avatarImageUrl: string;
  totalNumOfGames: number;
  winRate: number;
  buttons?: ReactNode;
};

export const UserCard: FC<Props> = memo((props) => {
  const {
    id,
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
          <LinkedAvatar
            size="sm"
            src={avatarImageUrl}
            linkUrl={`/app/users/${id}`}
            id={id}
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
