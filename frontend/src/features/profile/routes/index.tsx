import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Page404 } from 'features/auth/routes/Page404';
import { Profile } from './Profile';

export const ProfileRoutes: FC = () => {
  return (
    <Routes>
      <Route path="" element={<Profile />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
