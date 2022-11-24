import { FC, useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useRequestFriend } from 'features/friends/hooks/useRequestFriend';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const UsersList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);
  useEffect(() => {
    setUserList(users);
  }, [users]);

  const { requestFriend } = useRequestFriend();
  if (users === undefined) return <></>;
  const onClickRequestFriend = (id: string) => {
    requestFriend(id);
    setUserList(userList.filter((user) => user.id !== id));
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
                text="Request"
                id={user.id}
                onClick={(id) => {
                  onClickRequestFriend(id);
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
