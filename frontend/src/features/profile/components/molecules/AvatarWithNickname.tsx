import { memo, FC } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';
import { LinkedNickname } from 'components/atoms/text/LinkedNickname';

type Props = {
  nickname: string;
  avatarImageUrl: string;
  id: string;
};

export const AvatarWithNickname: FC<Props> = memo((props) => {
  const { nickname, avatarImageUrl, id } = props;

  return (
    <Box h="90" p={2}>
      <VStack>
        <LinkedAvatar id={id} size="md" src={avatarImageUrl} />
        <LinkedNickname id={id} nickname={nickname} maxWidth={20} />
      </VStack>
    </Box>
  );
});
