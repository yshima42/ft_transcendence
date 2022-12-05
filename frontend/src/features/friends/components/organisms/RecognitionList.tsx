import { FC, useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';
import { FriendRequestStatus, User } from '@prisma/client';
import { useFriendRequestRespond } from 'hooks/api';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const RecognitionList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);
  const { respondFriendRequest } = useFriendRequestRespond();
  useEffect(() => {
    setUserList(users);
  }, [users]);

  const onClickRespond = async (id: string, status: FriendRequestStatus) => {
    await respondFriendRequest({
      creatorId: id,
      status,
    });
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
                text="Accept"
                id={user.id}
                onClick={async (id) => {
                  await onClickRespond(id, 'ACCEPTED');
                }}
              />
              <UserCardButton
                text="Reject"
                id={user.id}
                onClick={async (id) => {
                  await onClickRespond(id, 'DECLINED');
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
