import { FC, memo } from 'react';
import { AvatarProps } from '@chakra-ui/react';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

// type Props = {
//   id: string;
//   src: string;
// };
type Props = AvatarProps & {
  id: string;
  src: string;
};

export const UserAvatar: FC<Props> = memo((props) => {
  const { id, src, ...avatarProps } = props;

  return (
    <LinkedAvatar src={src} linkUrl={`/app/users/${id}`} {...avatarProps} />
  );
});
