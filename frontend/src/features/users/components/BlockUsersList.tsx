import { FC, memo, useEffect } from 'react';
import { Image } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllBlock } from '../api/useAllBlock';
import { UnblockUser } from './UnblockUser';

export const BlockList: FC = memo(() => {
  const { getBlock, block } = useAllBlock();

  useEffect(() => getBlock(), [getBlock]);

  return (
    <PrimaryTable<User>
      data={block}
      columns={[
        {
          title: '',
          Cell({ entry: { name, avatarUrl } }) {
            return (
              <Image
                borderRadius="full"
                boxSize="48px"
                src={avatarUrl}
                alt={name}
              />
            );
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <Link to={`../${name}`}>{name}</Link>;
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <UnblockUser id={name} />;
          },
        },
      ]}
    />
  );
});
