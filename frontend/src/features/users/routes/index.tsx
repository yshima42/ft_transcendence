import { Route, Routes } from 'react-router-dom';
import { BlockList } from '../components/BlockUsersList';
import { FriendsList } from '../components/FriendsList';
import { UsersList } from '../components/UsersList';
import { Profile } from './Profile';
import { Stats } from './Stats';
import { Users } from './Users';

export const UsersRoutes = (): React.ReactElement => {
  return (
    <Routes>
      <Route path="" element={<Users />}>
        <Route path="" element={<FriendsList />} />
        <Route path="all" element={<UsersList />} />
        <Route path="block" element={<BlockList />} />
      </Route>
      <Route path="profile" element={<Profile />} />
      <Route path=":userId" element={<Stats />} />
    </Routes>
  );
};