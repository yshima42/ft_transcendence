import { FC } from 'react';
import { Grid } from '@chakra-ui/react';
import { useFriends, useProfile } from 'hooks/api';
import { DmButton } from 'components/atoms/button/DmButton';
import { GameOrWatchButton } from 'components/molecules/GameOrWatchButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

export const FriendsList: FC = () => {
  const { user: loginUser } = useProfile();
  const { users } = useFriends();

  if (users === undefined) return <></>;

  return (
    <Grid
      templateColumns={{
        md: 'repeat(1, 1fr)',
        lg: 'repeat(2, 1fr)',
      }}
      gap={6}
      data-test={'users-friends'}
    >
      {users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          username={user.name}
          nickname={user.nickname}
          avatarImageUrl={user.avatarImageUrl}
          buttons={
            <>
              <GameOrWatchButton
                loginUserId={loginUser.id}
                targetId={user.id}
              />
              <DmButton targetId={user.id} nickname={user.nickname} />
            </>
          }
          isFriend={true}
        />
      ))}
    </Grid>
  );
};
