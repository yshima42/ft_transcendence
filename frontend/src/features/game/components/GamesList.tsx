import { FC, memo, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllGames } from '../api/useAllGames';
import { Game } from '../types/game';

export const GamesList: FC = memo(() => {
  const { getGames, games } = useAllGames();

  useEffect(() => getGames(), [getGames]);

  return (
    <PrimaryTable<Game>
      data={games}
      columns={[
        {
          title: 'id',
          Cell({ entry: { id } }) {
            return <Box>{id}</Box>;
          },
        },
        {
          title: 'player1',
          Cell({ entry: { player1 } }) {
            return <Box>{player1}</Box>;
          },
        },
        {
          title: 'player2',
          Cell({ entry: { player2 } }) {
            return <Box>{player2}</Box>;
          },
        },
        {
          title: 'start time',
          Cell({ entry: { createdAt } }) {
            return <Box>{createdAt}</Box>;
          },
        },
        {
          title: '観戦',
          Cell({ entry: { id } }) {
            return (
              <Link to={`${id}`}>
                <Button>観戦</Button>
              </Link>
            );
          },
        },
      ]}
    />
  );
});
