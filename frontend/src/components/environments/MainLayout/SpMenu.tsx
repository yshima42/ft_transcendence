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
import { useLogout, useProfile } from 'hooks/api';
import { Link, useNavigate } from 'react-router-dom';
import { LogoButton } from 'components/atoms/button/LogoButton';
import { NavigationItem } from 'components/environments/MainLayout/MainLayout';

type Props = {
  items: NavigationItem[];
};

export const SpMenu: FC<Props> = memo((props) => {
  const { items } = props;
  const { user } = useProfile();
  const { logout, isLoading } = useLogout();

  const navigate = useNavigate();

  const onClickLogout = async () => {
    await logout({});
    navigate('/');
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon w={6} h={6} />}
          variant="none"
          position="absolute"
        />
        <MenuList>
          {items.map((item) => (
            <Link key={item.title} to={item.to}>
              <MenuItem icon={item.iconComponent}>{item.title}</MenuItem>
            </Link>
          ))}
          <MenuDivider />
          <Link to={`/app/users/${user.id}`}>
            <MenuItem icon={<InfoOutlineIcon />}>Profile</MenuItem>
          </Link>
          <MenuItem
            icon={<ArrowForwardIcon />}
            onClick={onClickLogout}
            isDisabled={isLoading}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
      <Flex position="absolute" left={8} top={0.5}>
        <LogoButton />
      </Flex>
    </>
  );
});
