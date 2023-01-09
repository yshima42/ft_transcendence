import { FC, memo, PropsWithChildren } from 'react';
import { Avatar, AvatarProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = AvatarProps &
  PropsWithChildren & {
    id: string;
    dataTestProp?: string;
  };

export const LinkedAvatar: FC<Props> = memo(
  ({ children, id, dataTestProp, ...avatarProps }: Props) => {
    return (
      <Link to={`/app/users/${id}`}>
        <Avatar data-test={dataTestProp} {...avatarProps}>
          {children}
        </Avatar>
      </Link>
    );
  }
);
