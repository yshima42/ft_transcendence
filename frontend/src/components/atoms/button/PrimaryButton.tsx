import { memo, FC, PropsWithChildren } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type Props = ButtonProps & PropsWithChildren;

export const PrimaryButton: FC<Props> = memo((props) => {
  const { children, ...buttonProps } = props;

  return (
    <Button
      bg="teal.300"
      color="white"
      _hover={{ opacity: 0.8 }}
      disabled={false}
      isLoading={false}
      {...buttonProps}
    >
      {children}
    </Button>
  );
});
