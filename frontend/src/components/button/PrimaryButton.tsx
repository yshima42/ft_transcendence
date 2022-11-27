import { memo, FC, ReactNode } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  bg?: string;
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick: VoidFunction;
};

/* my={10} bg="teal.300" color="white" */
export const PrimaryButton: FC<Props> = memo((props) => {
  const {
    children,
    bg = 'teal.300',
    disabled = false,
    loading = false,
    onClick,
  } = props;

  return (
    <Button
      bg={bg}
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
