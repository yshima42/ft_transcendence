import { FC } from 'react';
import { Grid } from '@chakra-ui/react';
import { useOutGoingUsers } from 'hooks/api';
import { CancelButton } from 'components/atoms/button/CancelButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

export const PendingList: FC = () => {
  const { users } = useOutGoingUsers();

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
          buttons={<CancelButton targetId={user.id} />}
        />
      ))}
    </Grid>
  );
};
