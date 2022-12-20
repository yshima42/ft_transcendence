import { FC } from 'react';
import { Grid } from '@chakra-ui/react';
import { useBlockUsers } from 'hooks/api';
import { UserCard } from 'features/friends/components/molecules/UserCard';
import { BlockButton } from '../atoms/UnblockButton';

export const BlockedList: FC = () => {
  const { users } = useBlockUsers();

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
              <BlockButton targetId={user.id} />
            </>
          }
        />
      ))}
    </Grid>
  );
};
