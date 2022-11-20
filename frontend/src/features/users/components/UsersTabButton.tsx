import { memo, FC, ReactNode } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  isSelect: boolean;
  isPending: boolean;
  onClick: () => void;
  children: ReactNode;
};

export const UsersTabButton: FC<Props> = memo((props) => {
  const { isSelect, isPending, onClick, children } = props;

  return (
    <Button
      size="sm"
      mr={1}
      borderRadius="20px"
      bg={isSelect ? 'teal.100' : 'gray.100'}
      opacity={isPending ? 0.5 : 1}
      onClick={onClick}
    >
      {children}
    </Button>
  );
});
