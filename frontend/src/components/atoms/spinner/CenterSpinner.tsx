import { FC, memo } from 'react';
import { Center, Spinner, SpinnerProps } from '@chakra-ui/react';

type Props = SpinnerProps & {
  h?: string;
  w?: string;
};

// 100% は親要素に対しての割合。100vh は画面いっぱい。
export const CenterSpinner: FC<Props> = memo((props) => {
  const { h = '100%', w = '100%', ...spinnerProps } = props;

  return (
    <Center h={h} w={w}>
      <Spinner
        color="blue.500"
        emptyColor="gray.200"
        size="xl"
        {...spinnerProps}
      />
    </Center>
  );
});
