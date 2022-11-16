import { memo, FC } from 'react';
import { ContentLayout } from 'components/templates/ContentLayout';
// import { DmSidebar } from '../components/DmSidebar';

// コンポーネント名はあとで変更する。ゲームの前の待機画面。ユーザー情報を表示させるイメージ
export const DirectMessage: FC = memo(() => {
  return (
    <>
      {/* <DmSidebar /> */}
      <ContentLayout>
        <p>Direct Messageです</p>
      </ContentLayout>
    </>
  );
});
