import { FC, memo, PropsWithChildren } from 'react';
import { Avatar, AvatarProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = AvatarProps &
  PropsWithChildren & {
    link: string;
    dataTest?: string;
  };

export const LinkedAvatar: FC<Props> = memo(
  ({ children, link, dataTest = '', ...avatarProps }: Props) => {
    return (
      <Link to={link}>
        <Avatar {...avatarProps} data-test={dataTest}>
          {children}
        </Avatar>
      </Link>
    );
  }
);
