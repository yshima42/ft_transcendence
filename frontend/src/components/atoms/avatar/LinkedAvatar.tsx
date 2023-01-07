import { FC, memo, PropsWithChildren } from 'react';
import { Avatar, AvatarProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = AvatarProps &
  PropsWithChildren & {
    dataTestProp?: string;
    link: string;
  };

export const LinkedAvatar: FC<Props> = memo(
  ({ children, dataTestProp, link, ...avatarProps }: Props) => {
    return (
      <Link to={link}>
        <Avatar data-test={dataTestProp} {...avatarProps}>
          {children}
        </Avatar>
      </Link>
    );
  }
);
