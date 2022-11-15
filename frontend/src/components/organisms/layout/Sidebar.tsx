import { memo, FC } from 'react';
import {
  StarIcon,
  ChatIcon,
  CheckCircleIcon,
  RepeatIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { Flex, Divider, Avatar } from '@chakra-ui/react';
import { MenuIconButton } from 'components/atoms/button/MenuIconButton';
import { UserNavigation } from 'components/molecules/UserNavigation';
import { NavItem } from './NavItem';

export type SideNavigationItem = {
  title: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export const Sidebar: FC = memo(() => {
  const navigation = [
    { title: 'TransPong', to: '.', icon: StarIcon },
    { title: 'Users', to: 'users', icon: RepeatIcon },
    { title: 'Games', to: 'games', icon: CheckCircleIcon },
    { title: 'Chats', to: 'chats', icon: ChatIcon },
    { title: 'Settings', to: 'settings', icon: SettingsIcon },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <>
      <Flex
        pos="sticky"
        h="100vh"
        marginTop="0"
        boxShadow="0 4px 12px 0 rgba(0,0,0,0.15)"
        minW="200px"
        maxW="200px"
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
        <Flex p="5%" flexDir="column" w="100%" mb={4}>
          <Flex mt={4} align="center">
            <UserNavigation />
            <Avatar size="sm" src="https://source.unsplash.com/random" />
            <Divider />
            <Flex flexDir="column" ml={4}></Flex>
          </Flex>
        </Flex>
      </Flex>
      <MenuIconButton items={navigation} />

      {/* <IconButton
        aria-label="Menu Button"
        background="non"
        mt={5}
        _hover={{ background: 'none' }}
        icon={<HamburgerIcon />}
        onClick={() => {
          navSize === 'small' ? setNavSize('large') : setNavSize('small');
        }}
        display={{ base: 'flex', md: 'none' }}
      /> */}
    </>
  );
});
