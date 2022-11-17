import { FC, memo } from 'react';
import { Button } from '@chakra-ui/react';
import { useDummyAuth } from '../hooks/useDummyAuth';

type Props = {
  dummyId: string;
};

export const DummyAuthButton: FC<Props> = memo((props) => {
  const { dummyLogin, loading } = useDummyAuth();
  const { dummyId } = props;

  return (
    <Button
      bg="gray.400"
      color="white"
      isLoading={loading}
      onClick={() => dummyLogin(dummyId)}
    >
      Admin Test {dummyId}
    </Button>
  );
});
