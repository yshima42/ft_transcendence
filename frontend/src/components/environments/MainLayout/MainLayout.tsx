import { FC, memo } from 'react';
import { AtSignIcon, ChatIcon, EmailIcon, ViewIcon } from '@chakra-ui/icons';
import { Box, Flex } from '@chakra-ui/react';
// import { Header } from 'components/organisms/layout/Header';
import { useMatch } from 'react-router-dom';
import { SpMenu } from 'components/environments/MainLayout/SpMenu';
import { WebSidebarMenu } from 'components/environments/MainLayout/WebSidebarMenu';

type MainProps = {
  children: React.ReactNode;
};

export type NavigationItem = {
  title: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  iconComponent: React.ReactElement;
};

export const MainLayout: FC<MainProps> = memo((props) => {
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
      to: 'dm/rooms',
      icon: EmailIcon,
      iconComponent: <EmailIcon />,
    },
    {
      title: 'MyChat',
      to: 'chat/rooms/me',
      icon: ChatIcon,
      iconComponent: <ChatIcon />,
    },
    {
      title: 'Chat',
      to: 'chat/rooms',
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

  const isGamePage = Boolean(useMatch('/app/games/:id'));

  return (
    <Flex>
      {isGamePage ? (
        <SpMenu items={navigation} />
      ) : (
        <>
          <Box display={{ base: 'none', md: 'flex' }}>
            <WebSidebarMenu items={navigation} />
          </Box>
          <Box display={{ base: 'flex', md: 'none' }}>
            <SpMenu items={navigation} />
          </Box>
        </>
      )}
      {children}
    </Flex>
  );
});
