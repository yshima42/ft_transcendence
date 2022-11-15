import { Route, Routes } from 'react-router-dom';
import { Profile } from './Profile';
import { Users } from './Users';

export const UsersRoutes = (): React.ReactElement => {
  return (
    <Routes>
      <Route path="" element={<Users />} />
      <Route path=":userId" element={<Profile />} />
    </Routes>
  );
};
