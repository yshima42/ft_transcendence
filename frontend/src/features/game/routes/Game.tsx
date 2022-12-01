import { memo, FC } from 'react';
import { Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { PongGame } from '../components/PongGame';

export const Game: FC = memo(() => {
  return (
    <ContentLayout>
      <Center>
        <PongGame />
      </Center>
      <Center>
        <Link to="/app">
          <Button>Back</Button>
        </Link>
      </Center>
    </ContentLayout>
  );
});
