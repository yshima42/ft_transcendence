import { FC, memo } from 'react';
import { Button } from '@chakra-ui/react';
import { API_URL } from 'config';

type Props = {
  dummyId: string;
};

export const DummyAuthButton: FC<Props> = memo((props) => {
  const { dummyId } = props;

  return (
    <Button
      bg="gray.400"
      color="white"
      as="a"
      href={`${API_URL}/auth/login/dummy?name=${dummyId}`}
      data-test={`${dummyId}-auth-button`}
    >
      Admin Test {dummyId}
    </Button>
  );
});
