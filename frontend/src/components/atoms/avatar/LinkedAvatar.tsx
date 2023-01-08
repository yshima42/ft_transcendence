import { FC, memo, PropsWithChildren } from 'react';
import { Avatar, AvatarProps } from '@chakra-ui/react';
import { useIsLoginUser } from 'hooks/api';
import { Link } from 'react-router-dom';

type Props = AvatarProps &
  PropsWithChildren & {
    id: string;
    dataTestProp?: string;
  };

export const LinkedAvatar: FC<Props> = memo(
  ({ children, id, dataTestProp, ...avatarProps }: Props) => {
    const { isLoginUser } = useIsLoginUser(id);
    const link = isLoginUser ? `/app/profile` : `/app/users/${id}`;

    return (
      <Link to={link}>
        <Avatar data-test={dataTestProp} {...avatarProps}>
          {children}
        </Avatar>
      </Link>
    );
  }
);
