import { FC } from 'react';
import { Grid } from '@chakra-ui/react';
import { useRequestableUsers } from 'hooks/api/friend/useRequestableUsers';
import { RequestButton } from 'components/atoms/button/RequestButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

export const RequestableUsersList: FC = () => {
  const { users } = useRequestableUsers();
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
          buttons={<RequestButton targetId={user.id} />}
          isFriend={false}
        />
      ))}
    </Grid>
  );
};
