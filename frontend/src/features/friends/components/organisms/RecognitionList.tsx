import { FC, useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useAcceptFriend } from 'features/friends/hooks/useAcceptFriend';
import { useRejectFriend } from 'features/friends/hooks/useRejectFriend';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const RecognitionList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);
  const { acceptFriend } = useAcceptFriend();
  const { rejectFriend } = useRejectFriend();
  useEffect(() => {
    setUserList(users);
  }, [users]);

  // friendships/accept
  const onClickAcceptFriend = (id: string) => {
    acceptFriend(id);
    setUserList(userList.filter((user) => user.id !== id));
  };

  // friendships/reject
  const onClickRejectFriend = (id: string) => {
    rejectFriend(id);
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
          username={user.name}
          nickname={user.nickname}
          avatarImageUrl={user.avatarUrl}
          winRate={50}
          totalNumOfGames={100}
          buttons={
            <>
              <UserCardButton
                text="Accept"
                id={user.id}
                onClick={(id) => {
                  onClickAcceptFriend(id);
                }}
              />
              <UserCardButton
                text="Reject"
                id={user.id}
                onClick={(id) => {
                  onClickRejectFriend(id);
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
