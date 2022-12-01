import { memo, FC } from 'react';
import { Flex, Divider } from '@chakra-ui/react';
import { LogoButton } from 'components/atoms/button/LogoButton';
import { NavigationItem } from 'components/environments/MainLayout/MainLayout';
import { NavItem } from './NavItem';
import { UserNavigation } from './UserNavigation';

type Props = {
  items: NavigationItem[];
};

export const WebSidebarMenu: FC<Props> = memo((props) => {
  const { items } = props;

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
          <Flex mt={5} flexDir="column" w="100%" alignItems="flex-start">
            <LogoButton />
          </Flex>
          {items.map((item) => (
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
    </>
  );
});
