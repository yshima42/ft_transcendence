import { FC, memo } from 'react';
import { VStack } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';
import { LinkedNickname } from 'components/atoms/text/LinkedNickname';

type Props = {
  user: User;
};

export const AvatarWithNickname: FC<Props> = memo((props) => {
  const { user } = props;

  return (
    <VStack alignItems={'center'}>
      <LinkedAvatar link={`/app/users/${user.id}`} src={user.avatarImageUrl} />
      <LinkedNickname id={user.id} nickname={user.nickname} />
    </VStack>
  );
});
