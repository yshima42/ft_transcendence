import { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useBlockUser } from '../api/useBlockUser';

type Props = {
  id: string;
};

export const BlockUser: FC<Props> = (props) => {
  const { blockUser } = useBlockUser();
  const { id } = props;

  const onClickBlockUser = () => {
    blockUser(id);
  };

  return <Button onClick={onClickBlockUser}>Block</Button>;
};
