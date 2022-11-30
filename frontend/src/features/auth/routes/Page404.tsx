import { memo, FC } from 'react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const Page404: FC = memo(() => {
  return (
    <ContentLayout>
      <p>Page404ページです</p>
    </ContentLayout>
  );
});
