import { FC } from 'react';
import { Grid, VStack } from '@chakra-ui/react';
import { useIncomingUsers } from 'hooks/api';
import { AcceptButton } from 'components/atoms/button/AcceptButton';
import { RejectButton } from 'components/atoms/button/RejectButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

export const RecognitionList: FC = () => {
  const { users } = useIncomingUsers();

  if (users === undefined) return <></>;

  return (
    <Grid
      templateColumns={{
        md: 'repeat(1, 1fr)',
        lg: 'repeat(2, 1fr)',
      }}
      gap={6}
    >
      {users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          username={user.name}
          nickname={user.nickname}
          avatarImageUrl={user.avatarImageUrl}
          winRate={50}
          totalNumOfGames={100}
          buttons={
            <VStack justify="center" align="center">
              <AcceptButton targetId={user.id} />
              <RejectButton targetId={user.id} />
            </VStack>
          }
        />
      ))}
    </Grid>
  );
};
