// import { Suspense } from 'react';
// import { Spinner } from '@chakra-ui/react';
// import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
// import { BlockList } from '../components/BlockUsersList';
// import { FriendsList } from '../components/FriendsList';
// import { UsersList } from '../components/UsersList';
import { Profile } from './Profile';
import { Stats } from './Stats';
import { Users } from './Users';

export const UsersRoutes = (): React.ReactElement => {
  return (
    <Routes>
      <Route path="" element={<Users />} />
      {/* <Route
          path=""
          element={
            <ErrorBoundary fallback={<p>Error</p>}>
              <Suspense fallback={<Spinner />}>
                <FriendsList />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="all"
          element={
            <ErrorBoundary fallback={<p>Error</p>}>
              <Suspense fallback={<Spinner />}>
                <UsersList />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="block"
          element={
            <ErrorBoundary fallback={<p>Error</p>}>
              <Suspense fallback={<Spinner />}>
                <BlockList />
              </Suspense>
            </ErrorBoundary>
          }
        /> */}
      {/* </Route> */}
      <Route path="profile" element={<Profile />} />
      <Route path=":userId" element={<Stats />} />
    </Routes>
  );
};
