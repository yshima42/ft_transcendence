import { FC, memo } from 'react';
import { Text, TextProps } from '@chakra-ui/react';
import { useIsLoginUser } from 'hooks/api';
import { Link } from 'react-router-dom';

type Props = TextProps & {
  id: string;
  nickname: string;
};

export const LinkedNickname: FC<Props> = memo((props) => {
  const { id, nickname, ...textProps } = props;
  const { isLoginUser } = useIsLoginUser(id);
  const link = isLoginUser ? `/app/profile` : `/app/users/${id}`;

  return (
    <Link to={link}>
      <Text maxWidth="none" noOfLines={1} {...textProps}>
        {nickname}
      </Text>
    </Link>
  );
});
