import { memo, FC, Suspense } from 'react';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { useIsLoginUser, useProfile } from 'hooks/api';
import { useParams } from 'react-router-dom';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { MatchHistoryCard } from '../components/organisms/MatchHistoryCard';
import { StatsCard } from '../components/organisms/StatsCard';
import { UserInfoCard } from '../components/organisms/UserInfoCard';

export const Profile: FC = memo(() => {
  const { id } = useParams();
  const { user } = useProfile(id);
  const { isLoginUser } = useIsLoginUser(user.id);

  return (
    <ContentLayout title="Profile">
      <Flex justify="center">
        <Grid
          minW={{ base: '500px', md: '740px' }}
          minH={{ base: '900px', md: '600px' }}
          templateAreas={{
            base: `"profile stats"
                  "profile stats"
                  "history history"
                  "history history"
                  "history history"
                  "history history"`,
            md: `"profile profile history history history"
                "stats   stats   history history history"`,
          }}
          gridTemplateRows={{
            base: `1fr 1fr 1fr 1fr 1fr 1fr`,
            md: '1fr 1fr',
          }}
          gridTemplateColumns={{
            base: `1fr 1fr`,
            md: '1fr 1fr 1fr 1fr 1fr 1fr',
          }}
          gap={5}
        >
          <GridItem area="profile">
            <Suspense fallback={<CenterSpinner />}>
              <UserInfoCard user={user} isLoginUser={isLoginUser} />
            </Suspense>
          </GridItem>
          <GridItem area="stats">
            <Suspense fallback={<CenterSpinner />}>
              <StatsCard id={user.id} />
            </Suspense>
          </GridItem>
          <GridItem area="history">
            <Suspense fallback={<CenterSpinner />}>
              <MatchHistoryCard id={user.id} isLoginUser={isLoginUser} />
            </Suspense>
          </GridItem>
        </Grid>
      </Flex>
    </ContentLayout>
  );
});
