import { FC, memo } from 'react';
import { Center, Spinner } from '@chakra-ui/react';

type Props = {
  h?: string;
  color?: string;
};

// 100% は親要素に対しての割合。100vh は画面いっぱい。
export const CenterSpinner: FC<Props> = memo(
  ({ h = '100%', color = 'blue.500' }: Props) => {
    return (
      <Center h={h} w="100%">
        <Spinner emptyColor="gray.200" color={color} size="xl" />
      </Center>
    );
  }
);
