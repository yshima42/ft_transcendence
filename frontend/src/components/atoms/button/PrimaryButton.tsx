import { memo, FC, ReactNode } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick: VoidFunction;
};

/* my={10} bg="teal.300" color="white" */
export const PrimaryButton: FC<Props> = memo((props) => {
  const { children, disabled = false, loading = false, onClick } = props;

  return (
    <Button
      bg="teal.300"
      color="white"
      onClick={onClick}
      _hover={{ opacity: 0.8 }}
      disabled={disabled || loading}
      isLoading={loading}
    >
      {children}
    </Button>
  );
});
