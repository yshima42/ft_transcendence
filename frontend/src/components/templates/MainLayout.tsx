import { FC, memo } from 'react';
// import { Outlet } from 'react-router-dom';
import { Header } from 'components/organisms/layout/Header';

type Props = {
  children: React.ReactNode;
};

export const MainLayout: FC<Props> = memo((props) => {
  const { children } = props;

  return (
    <>
      <Header />
      {children}
    </>
  );
});
