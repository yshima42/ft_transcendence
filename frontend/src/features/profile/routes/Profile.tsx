import { memo, FC } from 'react';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { ContentLayout } from 'components/layout/ContentLayout';
import { MatchHistoryCard } from '../components/MatchHistoryCard';
import { ProfileCardBase } from '../components/ProfileCardBase';
import { StatsCard } from '../components/StatsCard';
import { UserInfoCard } from '../components/UserInfoCard';

export const Profile: FC = memo(() => {
  return (
    <ContentLayout title="Profile">
      <Flex justify="center">
        <Grid
          w={{ base: '500px', md: '800px' }}
          h={{ base: '900px', md: '600px' }}
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
          <GridItem bg="gray" area="profile">
            <ProfileCardBase>
              <UserInfoCard />
            </ProfileCardBase>
          </GridItem>
          <GridItem bg="gray" area="stats">
            <ProfileCardBase>
              <StatsCard />
            </ProfileCardBase>
          </GridItem>
          <GridItem bg="gray" area="history">
            <ProfileCardBase>
              <MatchHistoryCard />
            </ProfileCardBase>
          </GridItem>
        </Grid>
      </Flex>
    </ContentLayout>
  );
});
