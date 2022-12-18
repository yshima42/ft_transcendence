import { FC, useEffect, useState } from 'react';
import { Grid } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useUserBlockCancel } from 'hooks/api';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const BlockedList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);

  const { cancelUserBlock } = useUserBlockCancel([
    ['/users/me/blocks'],
    ['block-relations'],
  ]);
  useEffect(() => {
    setUserList(users);
  }, [users]);

  if (users === undefined) return <></>;

  const onClickUnblock = async (id: string) => {
    await cancelUserBlock(id);
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
                text="UnBlock"
                id={user.id}
                onClick={async (id) => {
                  await onClickUnblock(id);
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
