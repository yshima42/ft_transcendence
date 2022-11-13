import { FC, memo } from 'react';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import axios from 'axios';
import { AiOutlineUser } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

type UserNavigationItem = {
  name: string;
  to: string;
  onClick: () => void;
};

export const UserNavigation: FC = memo(() => {
  // const [me, setMe] = useState('');
  const navigate = useNavigate();

  const onClickLogout = () => {
    const params = new URLSearchParams();
    axios
      .post('http://localhost:3000/auth/logout', params, {
        withCredentials: true,
      })
      .then(() => navigate('/', { replace: true }))
      .catch(() => alert('error'));
  };

  const userNavigation = [
    { name: 'Your Profile', to: './profile' },
    {
      name: 'Sign out',
      to: '',
      onClick: () => {
        onClickLogout();
      },
    },
  ].filter(Boolean) as UserNavigationItem[];

  return (
    <Menu>
      <MenuButton>
        <AiOutlineUser size={25} />
      </MenuButton>
      <MenuList color="gray.800">
        {userNavigation.map((item) => (
          <Link key={item.name} to={item.to} onClick={item.onClick}>
            <MenuItem>{item.name}</MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  );
});
