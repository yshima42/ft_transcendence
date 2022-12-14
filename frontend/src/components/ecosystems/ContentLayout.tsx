import { FC } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export const ContentLayout: FC<Props> = (props) => {
  const { children, title = '' } = props;

  return (
    <Container maxW="980px" px={{ base: 4, md: 8 }} py={{ base: 12, md: 8 }}>
      <Heading as="h2" size="md">
        {title}
      </Heading>
      <Box pt={8}>{children}</Box>
    </Container>
  );
};
