import { memo, FC } from 'react';
import {
  ArrowForwardIcon,
  HamburgerIcon,
  InfoOutlineIcon,
} from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useAuth } from 'features/auth/hooks/useAuth';
import { Link } from 'react-router-dom';
import { LogoButton } from 'components/atoms/button/LogoButton';
import { NavigationItem } from 'components/templates/MainLayout';

type Props = {
  items: NavigationItem[];
};

export const SpMenu: FC<Props> = memo((props) => {
  const { items } = props;
  const { logout } = useAuth();

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon w={6} h={6} />}
          variant="none"
          display={{ base: 'flex', md: 'none' }}
          position="absolute"
        />
        <MenuList>
          {items.map((item) => (
            <Link key={item.title} to={item.to}>
              <MenuItem icon={item.iconComponent}>{item.title}</MenuItem>
            </Link>
          ))}
          <MenuDivider />
          <Link to="/app/users/profile">
            <MenuItem icon={<InfoOutlineIcon />}>Profile</MenuItem>
          </Link>
          <MenuItem icon={<ArrowForwardIcon />} onClick={logout}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
      <Flex
        display={{ base: 'flex', md: 'none' }}
        position="absolute"
        left={8}
        top={0.5}
      >
        <LogoButton />
      </Flex>
    </>
  );
});
