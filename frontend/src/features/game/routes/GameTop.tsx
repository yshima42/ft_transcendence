import { memo, FC } from 'react';
import { Box, Button, Center, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/templates/ContentLayout';

export const GameTop: FC = memo(() => {
  return (
    <ContentLayout title="">
      <Center>
        <Stack spacing={4} py={4} px={10}>
          <Box w="100%" bg="gray.200">
            Stats Information
          </Box>
          <Link to="matching">
            <Button>Rank Match</Button>
          </Link>
        </Stack>
      </Center>
    </ContentLayout>
  );
});
