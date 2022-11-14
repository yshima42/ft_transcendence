import { memo, FC } from 'react';

import { UsersList } from 'features/users/components/UsersList';

// ここにはコンテンツのレイアウトコンポーネントを追加する予定
export const Users: FC = memo(() => {
  return (
    <>
      <UsersList />
    </>
  );
});
