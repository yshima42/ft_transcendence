import { memo, FC, Suspense } from 'react';
import { Flex, Grid, GridItem, Spinner } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate } from 'react-router-dom';
import { ContentLayout } from 'components/layout/ContentLayout';
import { MatchHistoryCard } from '../components/MatchHistoryCard';
import { ProfileCard } from '../components/ProfileCard';
import { StatsCard } from '../components/StatsCard';

export const Profile: FC = memo(() => {
  return (
    <ContentLayout title="Profile">
      <Flex justify="center">
        <Grid
          w={{ base: '500px', md: '800px' }}
          h="600px"
          templateAreas={{
            base: `"profile stats"
                   "profile stats"
                   "history history"
                   "history history"
                   "history history"`,
            md: `"profile profile history history history"
                 "stats   stats   history history history"`,
          }}
          gridTemplateRows={{
            base: `1fr 1fr 1fr 1fr 1fr`,
            md: '1fr 1fr',
          }}
          gridTemplateColumns={{
            base: `1fr 1fr`,
            md: '1fr 1fr 1fr 1fr 1fr 1fr',
          }}
          gap={5}
        >
          <GridItem bg="gray" area="profile">
            <ErrorBoundary fallback={<Navigate to="/" replace={true} />}>
              <Suspense fallback={<Spinner />}>
                <ProfileCard />
              </Suspense>
            </ErrorBoundary>
          </GridItem>
          <GridItem bg="gray" area="stats">
            <StatsCard />
          </GridItem>
          <GridItem bg="gray" area="history">
            <MatchHistoryCard />
          </GridItem>
        </Grid>
      </Flex>
    </ContentLayout>
  );
});
