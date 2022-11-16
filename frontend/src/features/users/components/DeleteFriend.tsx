import { FC } from 'react';
import { DeleteFilled } from '@ant-design/icons';
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

  return (
    <DeleteFilled
      style={{ fontSize: '20px', color: '#08c' }}
      onClick={onClickDeleteFriend}
    />
  );
};
