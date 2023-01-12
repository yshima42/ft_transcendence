import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        rounded: 'full',
      },
    },
  },
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
