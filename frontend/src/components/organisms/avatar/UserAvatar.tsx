import { FC, memo } from 'react';
import { AvatarProps } from '@chakra-ui/react';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

type Props = AvatarProps & {
  link: string;
};

export const UserAvatar: FC<Props> = memo(({ link, ...avatarProps }: Props) => {
  return <LinkedAvatar link={link} {...avatarProps} />;
});
