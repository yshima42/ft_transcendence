import { FC, useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useCancelFriend } from 'features/friends/hooks/useCancelFriend';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const PendingList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);
  const { cancelFriend } = useCancelFriend();
  useEffect(() => {
    setUserList(users);
  }, [users]);

  if (users === undefined) return <></>;
  // friendships/cancel
  const onClickCancelFriend = (id: string) => {
    console.log('before');
    console.log(userList);
    cancelFriend(id);
    setUserList(userList.filter((user) => user.id !== id));
    console.log('after');
    console.log(userList);
  };

  return (
    <Grid
      templateColumns={{
        md: 'repeat(1, 1fr)',
        lg: 'repeat(2, 1fr)',
      }}
      gap={6}
    >
      {userList.map((user) => (
        <UserCard
          key={user.id}
          username={user.name}
          nickname={user.nickname}
          avatarImageUrl={user.avatarUrl}
          winRate={50}
          totalNumOfGames={100}
          buttons={
            <>
              <UserCardButton
                text="Cancel"
                id={user.id}
                onClick={(id) => {
                  onClickCancelFriend(id);
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
