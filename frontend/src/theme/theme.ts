import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: 'gray.40',
        color: 'gray.800',
      },
    },
  },
});
export default theme;
