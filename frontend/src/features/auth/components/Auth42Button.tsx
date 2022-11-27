import { FC, memo, useState } from 'react';
import { Button } from '@chakra-ui/react';

export const Auth42Button: FC = memo(() => {
  const [loading42, setLoading42] = useState(false);

  const onClick42 = () => {
    setLoading42(true);
  };

  return (
    <Button
      bg="teal.300"
      color="white"
      isLoading={loading42}
      loadingText="Loading"
      onClick={onClick42}
      as="a"
      href="http://localhost:3000/auth/login/42"
    >
      42 Auth
    </Button>
  );
});
