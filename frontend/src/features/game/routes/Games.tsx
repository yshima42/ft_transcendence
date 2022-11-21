import { memo, FC } from 'react';
import { ContentLayout } from 'components/layout/ContentLayout';
import { GamesList } from '../components/GamesList';

export const Games: FC = memo(() => {
  return (
    <ContentLayout title="Games">
      <GamesList />
    </ContentLayout>
  );
});
