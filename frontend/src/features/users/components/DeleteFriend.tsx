import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useDeleteFriend } from '../api/useDeleteFriend';

type Props = {
  id: string;
};

export const DeleteFriend: FC<Props> = (props) => {
  const { deleteFriend } = useDeleteFriend();
  const { id } = props;

  const onClickDeleteFriend = () => {
    deleteFriend(id);
  };

  return <Button onClick={onClickDeleteFriend}>Unfriend</Button>;
};
