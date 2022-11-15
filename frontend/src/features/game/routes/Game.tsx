import { memo, FC } from 'react';
import { Center, Image } from '@chakra-ui/react';

export const Game: FC = memo(() => {
  return (
    <Center>
      <Image src="https://cms-assets.tutsplus.com/cdn-cgi/image/width=480/legacy-premium-tutorials/posts/25462/images/25462_b92f519db9cdcecbff3eb2c0e2d459ea.png" />
    </Center>
  );
});
