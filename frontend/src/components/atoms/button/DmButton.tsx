import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { AxiosError, isAxiosError } from 'axios';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

type Props = ButtonProps & {
  targetId: string;
};

export const DmButton: FC<Props> = memo((props) => {
  const navigate = useNavigate();
  const { targetId, ...buttonProps } = props;

  const onClickDm = async () => {
    try {
      const res = await axios.post(`/dm/rooms/${targetId}`);
      navigate(`/app/dm/rooms/${res.data as string}`, {
        state: { dmRoomId: res.data as string, memberId: targetId },
      });
    } catch (e) {
      const error = e as AxiosError;
      if (error.response == null) return;
      if (isAxiosError<{ message: string }>(error)) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <Button size="sm" onClick={onClickDm} {...buttonProps}>
      DM
    </Button>
  );
});
