import { FC, memo } from 'react';
import { Button } from '@chakra-ui/react';

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
      href={`http://localhost:3000/auth/login/dummy?name=${dummyId}`}
    >
      Admin Test {dummyId}
    </Button>
  );
});
