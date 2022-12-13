import { memo, FC } from 'react';
import { Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const Top: FC = memo(() => {
  return (
    <ContentLayout title="">
      <Center>
        <Link to="game">
          <Button>Match</Button>
        </Link>
      </Center>
    </ContentLayout>
  );
});
