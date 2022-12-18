import { FC, useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useFriendRequestAccept } from 'hooks/api';
import { useFriendRequestReject } from 'hooks/api/relations/useFriendRequestReject';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const RecognitionList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);

  const queryKeys = [
    ['friend-relation'],
    ['/users/me/friend-requests/incoming'],
  ];
  const { acceptFriendRequest } = useFriendRequestAccept(queryKeys);
  const { rejectFriendRequest } = useFriendRequestReject(queryKeys);
  useEffect(() => {
    setUserList(users);
  }, [users]);

  const onClickAccept = async (id: string) => {
    await acceptFriendRequest({
      creatorId: id,
    });
    setUserList(userList.filter((user) => user.id !== id));
  };

  const onClickReject = async (id: string) => {
    await rejectFriendRequest(id);
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
                  await onClickAccept(id);
                }}
              />
              <UserCardButton
                text="Reject"
                id={user.id}
                onClick={async (id) => {
                  await onClickReject(id);
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
