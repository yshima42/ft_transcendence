import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Page404 } from 'features/auth/routes/Page404';
import { Game } from './Game';
import { InGameList } from './InGameList';
import { Inviting } from './Inviting';
import { Matching } from './Matching';

export const GameRoutes: FC = () => {
  return (
    <Routes>
      <Route path="rooms" element={<InGameList />} />
      <Route path="rooms/:id" element={<Game />} />
      <Route path="matching" element={<Matching />} />
      <Route path="inviting" element={<Inviting />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
