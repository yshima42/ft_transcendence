import { memo, FC } from 'react';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useIsBlockedUser } from 'hooks/utils/useIsBlockedUser';
import { useIsLoginUser } from 'hooks/utils/useIsLoginUser';
import { useParams } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ProfileCardWrapper } from '../components/ProfileCardWrapper';
import { StatsCard } from '../components/StatsCard';
import { UserInfoCard } from '../components/UserInfoCard';
import { MatchHistoryCard } from '../components/matchhistory/MatchHistoryCard';

// /app/profile経由で表示するときはid=undefinedとなり、useProfileでログインユーザーの情報が取れる
// 少し可読性が低いので、余力あれば書き換えてもいいかもれない。
export const Profile: FC = memo(() => {
  const { id } = useParams();
  const { user } = useProfile(id);
  const { isLoginUser } = useIsLoginUser(user.id);
  const { isBlockedUser } = useIsBlockedUser(user.id);

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
              <UserInfoCard
                user={user}
                isLoginUser={isLoginUser}
                isBlockedUser={isBlockedUser}
              />
            </ProfileCardWrapper>
          </GridItem>
          <GridItem bg="gray" area="stats">
            <ProfileCardWrapper>
              <StatsCard id={user.id} />
            </ProfileCardWrapper>
          </GridItem>
          <GridItem bg="gray" area="history">
            <ProfileCardWrapper>
              <MatchHistoryCard id={user.id} />
            </ProfileCardWrapper>
          </GridItem>
        </Grid>
      </Flex>
    </ContentLayout>
  );
});
