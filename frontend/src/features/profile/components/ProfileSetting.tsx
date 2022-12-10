import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const ProfileSetting: FC = memo(() => {
  const navigate = useNavigate();

  return (
    <>
      <Button size="xs" onClick={() => navigate('/app/profile/edit')}>
        Edit
      </Button>
    </>
  );
});
