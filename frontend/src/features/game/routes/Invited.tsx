import { memo, FC } from 'react';
import { Center } from '@chakra-ui/react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const Invited: FC = memo(() => {
  return (
    <ContentLayout title="">
      <Center>You are invited</Center>
    </ContentLayout>
  );
});
