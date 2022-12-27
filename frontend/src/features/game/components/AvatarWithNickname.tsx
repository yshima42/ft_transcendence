import { FC, memo } from 'react';
import { VStack } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { LinkedNickname } from 'components/atoms/text/LinkedNickname';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';

type Props = {
  user: User;
};

export const AvatarWithNickname: FC<Props> = memo((props) => {
  const { user } = props;

  return (
    <VStack alignItems={'center'}>
      <UserAvatar id={user.id} src={user.avatarImageUrl} />
      <LinkedNickname id={user.id} nickname={user.nickname} />
    </VStack>
  );
});
