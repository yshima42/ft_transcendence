import { FC, memo, ReactNode } from 'react';
import { Avatar } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = {
  children?: ReactNode;
  size?: string;
  imageUrl?: string;
  linkUrl: string;
  name?: string;
  mr?: string;
  bg?: string;
  id: string;
};

export const LinkedAvatar: FC<Props> = memo((props) => {
  const {
    children,
    size,
    imageUrl: srcUrl,
    linkUrl: dstUrl,
    name,
    mr,
    bg,
    id,
  } = props;

  return (
    <Link to={dstUrl} state={id}>
      <Avatar size={size} src={srcUrl} name={name} mr={mr} bg={bg}>
        {children}
      </Avatar>
    </Link>
  );
});
