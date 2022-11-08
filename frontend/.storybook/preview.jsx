import theme from '../src/theme/theme.ts';
import { Box, ChakraProvider } from '@chakra-ui/react';
import '@storybook/addon-console';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// add chakra provider in storybook
export const decorators = [
  (Story) => (
    <ChakraProvider theme={theme}>
      <Story />
    </ChakraProvider>
  ),
];
