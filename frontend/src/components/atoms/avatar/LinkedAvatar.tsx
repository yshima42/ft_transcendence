import { FC, memo, ReactNode } from 'react';
import { Avatar, AvatarProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = AvatarProps & {
  children?: ReactNode;
  link: string;
};

export const LinkedAvatar: FC<Props> = memo(
  ({ children, link, ...avatarProps }: Props) => {
    return (
      <Link to={link}>
        <Avatar {...avatarProps}>{children}</Avatar>
      </Link>
    );
  }
);
