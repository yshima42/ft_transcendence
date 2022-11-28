import { FC, useEffect, useState } from 'react';
import { Grid } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useUnblock } from 'features/friends/hooks/useUnblock';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const BlockedList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);
  const { unblock } = useUnblock();
  useEffect(() => {
    setUserList(users);
  }, [users]);

  if (users === undefined) return <></>;

  const onClickUnblock = (id: string) => {
    unblock(id);
    console.log('before');
    console.log(userList);
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
      {users.map((user) => (
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
                text="UnBlock"
                id={user.id}
                onClick={(id) => {
                  onClickUnblock(id);
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
