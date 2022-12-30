import * as React from 'react';
import * as C from '@chakra-ui/react';

export const Spinner: React.FC = React.memo(() => (
  <C.Center h="50vh">
    <C.Spinner />
  </C.Center>
));
