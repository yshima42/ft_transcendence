import { Route, Routes } from 'react-router-dom';
import { Profile } from './Profile';
import { Stats } from './Stats';
import { Users } from './Users';

export const UsersRoutes = (): React.ReactElement => {
  return (
    <Routes>
      <Route path="" element={<Users />} />
      <Route path="profile" element={<Profile />} />
      <Route path=":userId" element={<Stats />} />
    </Routes>
  );
};
