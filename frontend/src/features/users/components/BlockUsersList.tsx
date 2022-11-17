import { FC, memo, useEffect } from 'react';
import { Avatar } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllBlock } from '../hooks/useAllBlock';
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
          Cell({ entry: { avatarUrl } }) {
            return <Avatar size="md" src={avatarUrl} />;
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
