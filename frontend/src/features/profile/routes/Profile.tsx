import { memo, FC, Suspense } from 'react';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import { useIsLoginUser, useProfile } from 'hooks/api';
import { useParams } from 'react-router-dom';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { StatsCard } from '../components/StatsCard';
import { UserInfoCard } from '../components/UserInfoCard';
import { MatchHistoryCard } from '../components/matchhistory/MatchHistoryCard';

// /app/profile経由で表示するときはid=undefinedとなり、useProfileでログインユーザーの情報が取れる
// 少し可読性が低いので、余力あれば書き換えてもいいかもれない。
export const Profile: FC = memo(() => {
  const { id } = useParams();
  const { user } = useProfile(id);
  const { isLoginUser } = useIsLoginUser(user.id);

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
            <Suspense fallback={<CenterSpinner />}>
              <UserInfoCard user={user} isLoginUser={isLoginUser} />
            </Suspense>
          </GridItem>
          <GridItem bg="gray" area="stats">
            <Suspense fallback={<CenterSpinner />}>
              <StatsCard id={user.id} />
            </Suspense>
          </GridItem>
          <GridItem bg="gray" area="history">
            <Suspense fallback={<CenterSpinner />}>
              <MatchHistoryCard id={user.id} />
            </Suspense>
          </GridItem>
        </Grid>
      </Flex>
    </ContentLayout>
  );
});
