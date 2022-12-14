import { FC, memo } from 'react';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

type Props = {
  id: string;
  src: string;
};

export const UserAvatar: FC<Props> = memo((props) => {
  const { id, src } = props;

  return <LinkedAvatar size="lg" src={src} linkUrl={`/app/users/${id}`} />;
});
