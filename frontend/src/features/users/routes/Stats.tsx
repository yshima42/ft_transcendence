import { memo, FC } from 'react';
import { Image } from '@chakra-ui/react';
import { ContentLayout } from 'components/layout/ContentLayout';
import { PrimaryTable } from 'components/table/PrimaryTable';

type UserStats = {
  id: string;
  imagePath: string;
  total: number;
  win: number;
  lose: number;
  ratio: number;
};

const mockUserData: UserStats = {
  id: 'dummy1',
  imagePath: '/random',
  total: 100,
  win: 60,
  lose: 40,
  ratio: 0.6,
};

type MatchHistory = {
  id: string;
  player: string;
  result: string;
  point: number;
};

const mockMatchHistory: MatchHistory[] = [
  {
    id: '1',
    player: 'dummy2',
    result: 'win',
    point: 33,
  },
  {
    id: '2',
    player: 'dummy3',
    result: 'lose',
    point: 12,
  },
  {
    id: '3',
    player: 'dummy4',
    result: 'win',
    point: 42,
  },
];

export const Stats: FC = memo(() => {
  // const { userId } = useParams();
  const { id, imagePath } = mockUserData;
  const imageBaseUrl = 'https://source.unsplash.com';

  return (
    <ContentLayout>
      <p>{`${id}`}</p>
      <br />

      <Image
        borderRadius="full"
        boxSize="160px"
        src={`${imageBaseUrl}${imagePath}`}
        alt={`${id}`}
        m="auto"
      />
      <br />

      <PrimaryTable<UserStats>
        data={[mockUserData]}
        columns={[
          {
            title: 'TOTAL',
            Cell({ entry: { total } }) {
              return <p>{total}</p>;
            },
          },
          {
            title: 'WIN',
            Cell({ entry: { win } }) {
              return <p>{win}</p>;
            },
          },
          {
            title: 'LOSE',
            Cell({ entry: { lose } }) {
              return <p>{lose}</p>;
            },
          },
          {
            title: 'RATIO',
            Cell({ entry: { ratio } }) {
              return <p>{ratio}</p>;
            },
          },
        ]}
      />

      <PrimaryTable<MatchHistory>
        data={mockMatchHistory}
        columns={[
          {
            title: 'No.',
            Cell({ entry: { id } }) {
              return <p>{id}</p>;
            },
          },
          {
            title: 'PLAYER',
            Cell({ entry: { player } }) {
              return <p>{player}</p>;
            },
          },
          {
            title: 'RESULT',
            Cell({ entry: { result } }) {
              return <p>{result}</p>;
            },
          },
          {
            title: 'POINT',
            Cell({ entry: { point } }) {
              return <p>{point}</p>;
            },
          },
        ]}
      />
    </ContentLayout>
  );
});
