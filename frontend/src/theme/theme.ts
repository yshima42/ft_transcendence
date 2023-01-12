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
        backgroundColor: 'gray.50',
        color: 'gray.700',
      },
    },
  },
});

export default theme;
