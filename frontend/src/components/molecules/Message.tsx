import * as React from 'react';
import * as C from '@chakra-ui/react';
import { HStack } from '@chakra-ui/react';
import { useIsLoginUser } from 'hooks/api';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';
import { LinkedNickname } from 'components/atoms/text/LinkedNickname';

type Props = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  nickname: string;
  avatarImageUrl: string;
};

export const Message: React.FC<Props> = ({
  id,
  content,
  createdAt,
  userId,
  nickname,
  avatarImageUrl,
}) => {
  const { isLoginUser } = useIsLoginUser(userId);

  return (
    <>
      {isLoginUser ? (
        <>
          <HStack alignSelf="flex-end">
            <C.Text fontSize="xs" color="gray.500">
              {new Date(createdAt).toLocaleString()}
            </C.Text>
          </HStack>
          <C.Box
            key={id}
            padding={4}
            backgroundColor="teal.200"
            borderRadius="lg"
            marginBottom={4}
            alignSelf="flex-end"
          >
            <C.Text minW="180px" maxW="360px">
              {content}
            </C.Text>
          </C.Box>
        </>
      ) : (
        <>
          <HStack>
            <LinkedAvatar
              id={userId}
              size="xs"
              name={nickname}
              src={avatarImageUrl}
              marginRight={2}
            />
            <LinkedNickname id={userId} nickname={nickname} fontSize="xs" />
            <C.Text fontSize="xs" color="gray.500">
              {new Date(createdAt).toLocaleString()}
            </C.Text>
          </HStack>
          <C.Box
            key={id}
            padding={4}
            backgroundColor="gray.100"
            borderRadius="lg"
            marginBottom={4}
            marginLeft={7}
          >
            <C.Text minW="180px" maxW="360px">
              {content}
            </C.Text>
          </C.Box>
        </>
      )}
    </>
  );
};
