import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useUnblockUser } from '../api/useUnblockUser';

type Props = {
  id: string;
};

export const UnblockUser: FC<Props> = (props) => {
  const { unblockUser } = useUnblockUser();
  const { id } = props;

  const onClickUnblockUser = () => {
    unblockUser(id);
  };

  return <Button onClick={onClickUnblockUser}>Unlock</Button>;
};
