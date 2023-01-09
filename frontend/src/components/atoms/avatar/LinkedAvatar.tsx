import { FC, memo, PropsWithChildren } from 'react';
import { Avatar, AvatarProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = AvatarProps &
  PropsWithChildren & {
    id: string;
  };

export const LinkedAvatar: FC<Props> = memo(
  ({ children, id, ...avatarProps }: Props) => {
    return (
      <Link to={`/app/users/${id}`}>
        <Avatar {...avatarProps}>{children}</Avatar>
      </Link>
    );
  }
);
