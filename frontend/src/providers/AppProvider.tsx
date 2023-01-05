import { FC, memo } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import theme from '../theme/theme';
import { ErrorProvider } from './ErrorProvider';

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

export const AppProvider: FC<Props> = memo((props) => {
  const { children } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <ErrorProvider>{children}</ErrorProvider>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
});
