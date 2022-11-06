import { FC, memo } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from 'components/organisms/layout/Header';

export const HeaderLayout: FC = memo(() => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
});
