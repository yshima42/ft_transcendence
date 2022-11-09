import { memo, FC, ReactNode } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
  bg: string;
  color: string;
  onClick: VoidFunction;
};

/* my={10} bg="teal.300" color="white" */
export const PrimaryButton: FC<Props> = memo((props) => {
  const { children, bg, color, onClick } = props;

  return (
    <Button bg={bg} color={color} onClick={onClick} _hover={{ opacity: 0.8 }}>
      {children}
    </Button>
  );
});
