import { FC, memo } from 'react';
import { Text } from '@chakra-ui/react';
import { useIsLoginUser } from 'hooks/api';
import { Link } from 'react-router-dom';

type Props = {
  id: string;
  nickname: string;
  maxWidth?: number;
};

export const LinkedNickname: FC<Props> = memo((props) => {
  const { id, nickname, maxWidth = 20 } = props;
  const { isLoginUser } = useIsLoginUser(id);
  const link = isLoginUser ? `/app/profile` : `/app/users/${id}`;

  return (
    <Link to={link}>
      <Text maxWidth={maxWidth} noOfLines={1}>
        {nickname}
      </Text>
    </Link>
  );
});
