import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Page404 } from 'features/auth/routes/Page404';
import { Users } from './Users';

export const FriendsRoutes: FC = () => {
  return (
    <Routes>
      <Route path="" element={<Users />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
