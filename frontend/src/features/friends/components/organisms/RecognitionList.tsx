import { FC, useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useAccept } from 'features/friends/hooks/useAccept';
import { useReject } from 'features/friends/hooks/useReject';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const RecognitionList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);
  const { accept } = useAccept();
  const { reject } = useReject();
  useEffect(() => {
    setUserList(users);
  }, [users]);

  const onClickAccept = (id: string) => {
    accept(id);
    setUserList(userList.filter((user) => user.id !== id));
  };

  const onClickReject = (id: string) => {
    reject(id);
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
                onClick={(id) => {
                  onClickAccept(id);
                }}
              />
              <UserCardButton
                text="Reject"
                id={user.id}
                onClick={(id) => {
                  onClickReject(id);
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
