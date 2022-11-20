import { memo, FC, Suspense } from 'react';
import { Flex } from '@chakra-ui/react';
import { ContentLayout } from 'components/templates/ContentLayout';
import { AvatarWithUploadButton } from '../components/AvatarWithUploadButton';
import { ProfileCard } from '../components/ProfileCard';
import { ReactQuery } from './ReactQuery';

export const Profile: FC = memo(() => {
  return (
    <ContentLayout title="Profile">
      <Flex justify="center" padding={{ base: 5, md: 7 }}>
        <AvatarWithUploadButton
          name="marvin"
          avatarUrl="https://source.unsplash.com/random"
        />
        <ProfileCard name="yuuyuu" nickname="hakusho" />
      </Flex>
      <Suspense fallback={<p>Now loading...</p>}>
        <ReactQuery />
      </Suspense>
    </ContentLayout>
  );
});
