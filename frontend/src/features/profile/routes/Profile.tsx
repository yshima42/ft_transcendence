import { memo, FC } from 'react';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { ContentLayout } from 'components/layout/ContentLayout';
import { ProfileCardWrapper } from '../components/ProfileCardWrapper';
import { StatsCard } from '../components/StatsCard';
import { UserInfoCard } from '../components/UserInfoCard';
import { MatchHistoryCard } from '../components/matchhistory/MatchHistoryCard';

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
            <ProfileCardWrapper>
              <UserInfoCard />
            </ProfileCardWrapper>
          </GridItem>
          <GridItem bg="gray" area="stats">
            <ProfileCardWrapper>
              <StatsCard />
            </ProfileCardWrapper>
          </GridItem>
          <GridItem bg="gray" area="history">
            <ProfileCardWrapper>
              <MatchHistoryCard />
            </ProfileCardWrapper>
          </GridItem>
        </Grid>
      </Flex>
    </ContentLayout>
  );
});
