import { memo, FC, ReactNode } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  isSelect: boolean;
  onClick: () => void;
  children: ReactNode;
};

export const UsersTabButton: FC<Props> = memo((props) => {
  const { isSelect, onClick, children } = props;

  return (
    <Button
      size="sm"
      mr={1}
      borderRadius="20px"
      bg={isSelect ? 'teal.100' : 'gray.100'}
      onClick={onClick}
    >
      {children}
    </Button>
  );
});
