import { memo, FC } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { LinkedNickname } from 'components/atoms/text/LinkedNickname';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';

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
        <UserAvatar id={id} size="md" src={avatarImageUrl} />

        {/* TODO:ニックネームが長くなるときどう表示するか考える。暫定で省略している */}
        <LinkedNickname id={id} nickname={nickname} />
      </VStack>
    </Box>
  );
});
