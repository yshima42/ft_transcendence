import { FC, memo, useEffect } from 'react';
import { Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllBlock } from '../api/useAllBlock';
import { User } from '../types/user';

export const BlockList: FC = memo(() => {
  const { getBlock, block } = useAllBlock();

  useEffect(() => getBlock(), [getBlock]);

  return (
    <PrimaryTable<User>
      data={block}
      columns={[
        {
          title: '',
          Cell({ entry: { name } }) {
            return (
              <Image
                boxSize="48px"
                src="https://source.unsplash.com/random"
                alt={name}
              />
            );
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <Link to={`./${name}`}>{name}</Link>;
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <Button about={name}>ブロック解除</Button>;
          },
        },
      ]}
    />
  );
});
