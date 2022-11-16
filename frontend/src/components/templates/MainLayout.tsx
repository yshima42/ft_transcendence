import { FC, memo } from 'react';
import { Flex } from '@chakra-ui/react';
// import { Header } from 'components/organisms/layout/Header';
import { Sidebar } from 'components/organisms/layout/Sidebar';

type Props = {
  children: React.ReactNode;
};

// ヘッダーに戻す場合は<Sidebar />を<Header />にして<Flex>を<>にする
export const MainLayout: FC<Props> = memo((props) => {
  const { children } = props;

  return (
    <Flex>
      <Sidebar />
      {children}
    </Flex>
  );
});
