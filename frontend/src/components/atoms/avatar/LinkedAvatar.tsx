import { FC, memo, ReactNode } from 'react';
import { Avatar, AvatarProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type LinkedAvatarProps = AvatarProps & {
  children?: ReactNode;
  link: string;
};

export const LinkedAvatar: FC<LinkedAvatarProps> = memo((props) => {
  const { children, link, ...avatarProps } = props;

  return (
    <Link to={link}>
      <Avatar {...avatarProps}>{children}</Avatar>
    </Link>
  );
});
