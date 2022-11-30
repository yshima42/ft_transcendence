import { memo, FC } from 'react';
import { Button, Center, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const Game: FC = memo(() => {
  return (
    <ContentLayout>
      <Center>
        <Image src="https://cms-assets.tutsplus.com/cdn-cgi/image/width=480/legacy-premium-tutorials/posts/25462/images/25462_b92f519db9cdcecbff3eb2c0e2d459ea.png" />
      </Center>
      <Center>
        <Link to="/app">
          <Button>Back</Button>
        </Link>
      </Center>
    </ContentLayout>
  );
});
