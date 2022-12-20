import { memo, FC } from 'react';
import { Button, Center } from '@chakra-ui/react';
import { useToastCheck } from 'hooks/utils/useToastCheck';
import { useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const Top: FC = memo(() => {
  const navigate = useNavigate();
  useToastCheck();

  return (
    <ContentLayout title="">
      <Center>
        <Button onClick={() => navigate('/app/matching')}>Match</Button>
      </Center>
    </ContentLayout>
  );
});
