import { FC } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export const ContentLayout: FC<Props> = (props) => {
  const { children, title = '' } = props;

  return (
    <Container maxW="980px" p={8}>
      <Heading as="h2" size="md">
        {title}
      </Heading>
      <Box py={8}>{children}</Box>
    </Container>
  );
};
