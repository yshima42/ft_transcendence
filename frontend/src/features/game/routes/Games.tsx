import { memo, FC } from 'react';
import { ContentLayout } from 'components/templates/ContentLayout';
import { GamesList } from '../components/GamesList';

export const Games: FC = memo(() => {
  return (
    <ContentLayout title="ゲーム一覧">
      <GamesList />
    </ContentLayout>
  );
});
