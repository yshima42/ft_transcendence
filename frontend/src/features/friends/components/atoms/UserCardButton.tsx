import { FC } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  id: string;
  text: string;
  onClick: (id: string) => void;
};

export const UserCardButton: FC<Props> = (props) => {
  const { text, id, onClick } = props;

  return (
    <Button mr={2} onClick={() => onClick(id)}>
      {text}
    </Button>
  );
};
