import { memo, FC } from 'react';
import { Flex, Heading, Box, useDisclosure } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MenuIconButton } from 'components/atoms/button/MenuIconButton';
import { MenuDrawer } from 'components/molecules/MenuDrawer';
import { AuthStatus } from 'router/Router';

export const Header: FC = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  return (
    <>
      <Flex
        as="nav"
        bg="teal.400"
        color="gray.50"
        align="center"
        justify="space-batween"
        padding={{ base: 3, md: 5 }}
      >
        <Flex
          align="center"
          as="a"
          mr={8}
          _hover={{ cursor: 'pointer' }}
          onClick={() => navigate('/user-list', { replace: true })}
        >
          <Heading as="h1" fontSize={{ base: 'md', md: 'lg' }}>
            TransPong
          </Heading>
        </Flex>
        <Flex
          align="center"
          fontSize="sm"
          flexGrow={2}
          display={{ base: 'none', md: 'flex' }}
        >
          <Box pr={4}>
            <NavLink to="/game-select">ゲーム選択</NavLink>
          </Box>
          <Box pr={4}>
            <NavLink to="/chatroom-list">チャットルーム</NavLink>
          </Box>
        </Flex>
        <AuthStatus />
        <MenuIconButton onOpen={onOpen} />
      </Flex>
      <MenuDrawer onClose={onClose} isOpen={isOpen} />
    </>
  );
});
