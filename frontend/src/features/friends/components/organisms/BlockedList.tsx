import { FC } from 'react';
import { Grid } from '@chakra-ui/react';
import { useBlockUsers } from 'hooks/api';
import { UnblockButton } from 'components/atoms/button/UnblockButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

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
      data-test={'users-blocked-grid'}
    >
      {users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          username={user.name}
          nickname={user.nickname}
          avatarImageUrl={user.avatarImageUrl}
          buttons={<UnblockButton targetId={user.id} size={'sm'} />}
          isFriend={false}
        />
      ))}
    </Grid>
  );
};
