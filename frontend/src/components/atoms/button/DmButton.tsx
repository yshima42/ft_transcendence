import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

type Props = {
  targetId: string;
  size?: string;
};

export const DmButton: FC<Props> = memo((props) => {
  const navigate = useNavigate();
  const { targetId, size = 'sm' } = props;

  const onClickDm = async () => {
    const res = await axios.post(`/dm/rooms/${targetId}`);
    navigate(`/app/dm/rooms/${res.data as string}`, {
      state: { dmRoomId: res.data as string },
    });
  };

  return (
    <Button size={size} onClick={onClickDm}>
      DM
    </Button>
  );
});
