import { FC, memo } from 'react';
import { Text, TextProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = TextProps & {
  id: string;
  nickname: string;
};

export const LinkedNickname: FC<Props> = memo((props) => {
  const { id, nickname, ...textProps } = props;

  return (
    <Link to={`/app/users/${id}`}>
      <Text maxWidth="200px" noOfLines={1} {...textProps}>
        {nickname}
      </Text>
    </Link>
  );
});
