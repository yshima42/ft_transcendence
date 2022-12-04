import { FC, memo, ReactNode } from 'react';
import { Avatar, AvatarProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type LinkedAvatarProps = AvatarProps & {
  children?: ReactNode;
  linkUrl: string;
};

export const LinkedAvatar: FC<LinkedAvatarProps> = memo((props) => {
  const { children, size, src, name, mr, bg, linkUrl } = props;

  return (
    <Link to={linkUrl}>
      <Avatar size={size} src={src} name={name} mr={mr} bg={bg}>
        {children}
      </Avatar>
    </Link>
  );
});
