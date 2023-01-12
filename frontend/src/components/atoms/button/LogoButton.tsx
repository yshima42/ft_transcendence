import { FC, memo } from 'react';
import { Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const LogoButton: FC = memo(() => {
  return (
    <Link to="/app">
      <Text
        px={3}
        bgGradient="linear(to-l, teal.500, teal.300)"
        bgClip="text"
        fontSize="2xl"
        fontWeight="extrabold"
      >
        TransPong
      </Text>
    </Link>
  );
});
