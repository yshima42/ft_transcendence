import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { AxiosError } from 'axios';
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
    try {
      const res = await axios.post(`/dm/rooms/${targetId}`);
      navigate(`/app/dm/rooms/${res.data as string}`, {
        state: { dmRoomId: res.data as string, memberId: targetId },
      });
    } catch (e) {
      const error = e as AxiosError;
      if (error == null) return;
      if (error.response == null) return;
      // 400系のエラーなら警告
      if (error.response.status >= 400 && error.response.status < 500) {
        alert(error.response.data?.message ?? 'error');
      }
    }
  };

  return (
    <Button size={size} onClick={onClickDm}>
      DM
    </Button>
  );
});
