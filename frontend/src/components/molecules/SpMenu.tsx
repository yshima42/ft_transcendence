import { memo, FC } from 'react';
import {
  ArrowForwardIcon,
  HamburgerIcon,
  InfoOutlineIcon,
} from '@chakra-ui/icons';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { SideNavigationItem } from 'components/organisms/layout/Sidebar';

type Props = {
  items: SideNavigationItem[];
};

export const SpMenu: FC<Props> = memo((props) => {
  const { items } = props;

  // ここをサイドバーと共通化させたい
  const navigate = useNavigate();
  const onClickLogout = () => {
    const params = new URLSearchParams();
    axios
      .post('http://localhost:3000/auth/logout', params, {
        withCredentials: true,
      })
      .then(() => navigate('/'))
      .catch(() => alert('error'));
  };

  return (
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
        <MenuItem icon={<ArrowForwardIcon />} onClick={onClickLogout}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
});
