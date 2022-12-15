import { FC, memo, ReactNode } from 'react';
import { Avatar, AvatarProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type LinkedAvatarProps = AvatarProps & {
  children?: ReactNode;
  linkUrl: string;
};

export const LinkedAvatar: FC<LinkedAvatarProps> = memo((props) => {
  const { children, linkUrl, ...avatarProps } = props;

  return (
    <Link to={linkUrl}>
      <Avatar {...avatarProps}>{children}</Avatar>
    </Link>
  );
});
