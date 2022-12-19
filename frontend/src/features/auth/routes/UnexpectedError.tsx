import { memo, FC } from 'react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const UnexpectedError: FC = memo(() => {
  return (
    <ContentLayout>
      <p>Unexpected Error</p>
    </ContentLayout>
  );
});
