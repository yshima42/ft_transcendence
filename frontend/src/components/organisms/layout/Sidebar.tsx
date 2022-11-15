import { memo, FC, useState } from 'react';
import {
  StarIcon,
  ChatIcon,
  CheckCircleIcon,
  HamburgerIcon,
  RepeatIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import {
  Flex,
  useDisclosure,
  Divider,
  Avatar,
  IconButton,
} from '@chakra-ui/react';
import { MenuDrawer } from 'components/molecules/MenuDrawer';
import { UserNavigation } from 'components/molecules/UserNavigation';
import { NavItem } from './NavItem';
import '../../../App.css';

export const Sidebar: FC = memo(() => {
  const { isOpen, onClose } = useDisclosure();

  const [navSize, changeNavSize] = useState('large');

  return (
    <>
      <Flex
        pos="sticky"
        left="5"
        h="95vh"
        marginTop="2.5vh"
        boxShadow="0 4px 12px 0 rgba(0,0,0,0.05)"
        borderRadius={navSize === 'small' ? '15px' : '30px'}
        w={navSize === 'small' ? '75px' : '200px'}
        flexDir="column"
        justifyContent="space-between"
      >
        <Flex p="5%" flexDir="column" w="100%" alignItems="flex-start" as="nav">
          <IconButton
            aria-label="メニューボタン"
            background="non"
            mt={5}
            _hover={{ background: 'none' }}
            icon={<HamburgerIcon />}
            onClick={() => {
              if (navSize === 'small') changeNavSize('large');
              else changeNavSize('small');
            }}
          />
          <NavItem to="." navSize={navSize} icon={StarIcon} title="TransPong" />
          <NavItem
            to="users"
            navSize={navSize}
            icon={RepeatIcon}
            title="Users"
          />
          <NavItem
            to="games"
            navSize={navSize}
            icon={CheckCircleIcon}
            title="Game"
          />
          <NavItem
            to="chats"
            navSize={navSize}
            icon={ChatIcon}
            title="Chat Room"
          />
          <NavItem
            to="setting"
            navSize={navSize}
            icon={SettingsIcon}
            title="Setting"
          />
        </Flex>
        <Flex
          p="5%"
          flexDir="column"
          w="100%"
          alignItems={navSize === 'small' ? 'none' : 'flex'}
          mb={4}
        >
          <Flex mt={4} align="center">
            <Avatar size="sm" src="https://source.unsplash.com/random" />
            <Divider display={navSize === 'small' ? 'none' : 'flex'} />
            <Flex
              flexDir="column"
              ml={4}
              display={navSize === 'small' ? 'none' : 'flex'}
            ></Flex>
            <UserNavigation />
          </Flex>
        </Flex>
      </Flex>
      <MenuDrawer onClose={onClose} isOpen={isOpen} />
    </>
  );
});
