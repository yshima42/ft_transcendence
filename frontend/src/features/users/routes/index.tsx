import { Route, Routes } from 'react-router-dom';
import { Stats } from './Stats';
import { Users } from './Users';

export const UsersRoutes = (): React.ReactElement => {
  return (
    <Routes>
      <Route path="" element={<Users />} />
      <Route path=":userId" element={<Stats />} />
    </Routes>
  );
};
