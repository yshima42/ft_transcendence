import { FC, useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useFriendRequestCancel } from 'hooks/api';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const PendingList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);
  const { cancelFriendRequest } = useFriendRequestCancel([
    ['friend-relation'],
    ['/users/me/friend-requests/outgoing'],
  ]);
  useEffect(() => {
    setUserList(users);
  }, [users]);

  if (users === undefined) return <></>;

  const onClickCancel = async (id: string) => {
    await cancelFriendRequest(id);
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
      {userList.map((user) => (
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
              <UserCardButton
                text="Cancel"
                id={user.id}
                onClick={async (id) => {
                  await onClickCancel(id);
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
