import * as React from 'react';
import * as C from '@chakra-ui/react';
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
  return (
    <C.Box
      key={id}
      padding={4}
      backgroundColor="gray.100"
      borderRadius="lg"
      marginBottom={4}
    >
      <C.Text fontSize="xs" color="gray.500">
        {new Date(createdAt).toLocaleString()}
      </C.Text>
      <LinkedNickname id={userId} nickname={nickname} />
      <LinkedAvatar
        id={userId}
        size="sm"
        name={nickname}
        src={avatarImageUrl}
        marginRight={2}
      />
      <C.Text data-test={`message-${content}`}>{content}</C.Text>
    </C.Box>
  );
};
