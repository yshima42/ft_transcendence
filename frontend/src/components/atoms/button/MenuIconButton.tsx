import { memo, FC } from 'react';
import { StarIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SideNavigationItem } from 'components/organisms/layout/Sidebar';

type Props = {
  items: SideNavigationItem[];
};

export const MenuIconButton: FC<Props> = memo((props) => {
  const { items } = props;

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="none"
        display={{ base: 'flex', md: 'none' }}
      />
      <MenuList>
        {items.map((item) => (
          <Link key={item.title} to={item.to}>
            <MenuItem icon={<StarIcon />}>{item.title}</MenuItem>
          </Link>
        ))}
        <MenuDivider />
        <MenuItem>Profile</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
});
