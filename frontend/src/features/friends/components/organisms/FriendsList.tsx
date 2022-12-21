import { FC } from 'react';
import { Grid } from '@chakra-ui/react';
import { useFriends } from 'hooks/api';
import { DmButton } from 'components/atoms/button/DmButton';
import { GameButton } from 'components/atoms/button/GameButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

export const FriendsList: FC = () => {
  const { users } = useFriends();

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
            <>
              <GameButton targetId={user.id} />
              <DmButton targetId={user.id} />
            </>
          }
        />
      ))}
    </Grid>
  );
};
