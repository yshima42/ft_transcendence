import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useAddFriend } from '../api/useAddFriend';

type Props = {
  id: string;
};

export const AddFriend: FC<Props> = (props) => {
  const { addFriend } = useAddFriend();
  const { id } = props;

  const onClickAddFriend = () => {
    addFriend(id);
  };

  return <Button onClick={onClickAddFriend}>Add</Button>;
};
