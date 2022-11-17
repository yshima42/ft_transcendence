import { memo, FC } from 'react';
import {
  StarIcon,
  ChatIcon,
  AtSignIcon,
  ViewIcon,
  EmailIcon,
} from '@chakra-ui/icons';
import { Flex, Divider } from '@chakra-ui/react';
import { MenuIconButton } from 'components/atoms/button/MenuIconButton';
import { UserNavigation } from 'components/molecules/UserNavigation';
import { NavItem } from './NavItem';

export type SideNavigationItem = {
  title: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  iconComponent: React.ReactElement;
};

export const Sidebar: FC = memo(() => {
  const navigation = [
    {
      title: 'TransPong',
      to: '.',
      icon: StarIcon,
      iconComponent: <StarIcon />,
    },
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
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <>
      <Flex
        pos="sticky"
        h="100vh"
        marginTop="0"
        boxShadow="0 4px 12px 0 rgba(0,0,0,0.15)"
        minW={{ base: '50px', md: '180px' }}
        maxW={{ base: '50px', md: '180px' }}
        flexDir="column"
        justifyContent="space-between"
        display={{ base: 'none', md: 'flex' }}
      >
        <Flex p="5%" flexDir="column" w="100%" alignItems="flex-start" as="nav">
          {navigation.map((item) => (
            <NavItem
              key={item.title}
              title={item.title}
              to={item.to}
              icon={item.icon}
            />
          ))}
        </Flex>
        <Flex p="5%" flexDir="column" w="100%" mb={4} as="nav">
          <Divider />
          <UserNavigation />
        </Flex>
      </Flex>
      <MenuIconButton items={navigation} />
    </>
  );
});
