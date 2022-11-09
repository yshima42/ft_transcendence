import { memo, FC, ReactNode } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
};

export const PrimaryButton: FC<Props> = memo((props) => {
  const { children } = props;

  return (
    <Button my={10} bg="teal.300" color="white" _hover={{ opacity: 0.8 }}>
      {children}
    </Button>
  );
});
