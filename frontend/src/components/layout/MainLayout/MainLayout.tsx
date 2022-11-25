import { FC, memo } from 'react';
import { AtSignIcon, ChatIcon, EmailIcon, ViewIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
// import { Header } from 'components/organisms/layout/Header';
import { SpMenu } from 'components/layout/MainLayout/SpMenu';
import { WebSidebarMenu } from 'components/layout/MainLayout/WebSidebarMenu';

type Props = {
  children: React.ReactNode;
};

export type NavigationItem = {
  title: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  iconComponent: React.ReactElement;
};

export const MainLayout: FC<Props> = memo((props) => {
  const { children } = props;
  const navigation = [
    {
      title: 'Users',
      to: 'users',
      icon: AtSignIcon,
      iconComponent: <AtSignIcon />,
    },
    {
      title: 'DM',
      to: 'dm',
      icon: EmailIcon,
      iconComponent: <EmailIcon />,
    },
    {
      title: 'Chat',
      to: 'chats',
      icon: ChatIcon,
      iconComponent: <ChatIcon />,
    },
    {
      title: 'Watch',
      to: 'games',
      icon: ViewIcon,
      iconComponent: <ViewIcon />,
    },
  ].filter(Boolean) as NavigationItem[];

  return (
    <Flex>
      <WebSidebarMenu items={navigation} />
      <SpMenu items={navigation} />
      {children}
    </Flex>
  );
});