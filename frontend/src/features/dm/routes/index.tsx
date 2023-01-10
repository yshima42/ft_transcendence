import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Page404 } from 'features/auth/routes/Page404';
import { DmRoom } from './DmRoom';
import { DmRooms } from './DmRooms';

export const DmRoutes: FC = () => {
  return (
    <Routes>
      <Route path="rooms" element={<DmRooms />} />
      <Route path="rooms/:chatRoomId" element={<DmRoom />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
