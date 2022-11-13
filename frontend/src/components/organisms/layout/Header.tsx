import { memo, FC } from 'react';
import { Flex, Heading, Box, useDisclosure } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIconButton } from 'components/atoms/button/MenuIconButton';
import { MenuDrawer } from 'components/molecules/MenuDrawer';
import { UserNavigation } from 'components/molecules/UserNavigation';

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
        justify="space-between"
        padding={{ base: 3, md: 5 }}
      >
        <Flex
          align="center"
          as="a"
          mr={8}
          _hover={{ cursor: 'pointer' }}
          onClick={() => navigate('users', { replace: true })}
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
            <Link to="game-select">ゲーム選択</Link>
          </Box>
          <Link to="chatroom-list">チャットルーム</Link>
        </Flex>
        <UserNavigation />
        <MenuIconButton onOpen={onOpen} />
      </Flex>
      <MenuDrawer onClose={onClose} isOpen={isOpen} />
    </>
  );
});
