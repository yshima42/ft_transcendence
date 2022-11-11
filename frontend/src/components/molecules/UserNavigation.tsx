import { FC, memo } from 'react';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import axios from 'axios';
import { AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

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

  // axios
  //   .get<User>('http://localhost:3000/user/me', { withCredentials: true })
  //   .then((res) => {
  //     setMe(res.data.name);
  //   })
  //   .catch(() => navigate('/', { replace: true }));
  return (
    <Menu>
      <MenuButton>
        <AiOutlineUser size={30} />
      </MenuButton>
      <MenuList>
        {userNavigation.map((item) => (
          <MenuItem key={item.name}>{item.name}</MenuItem>
        ))}
      </MenuList>
    </Menu>
    // <>
    //   <Link to="profile">
    //     <Box px={4}>{me}</Box>
    //   </Link>
    //   <Icon
    //     as={GrLogout}
    //     onClick={onClickLogout}
    //     cursor="pointer"
    //     _hover={{ opacity: 0.8 }}
    //   >
    //     logout
    //   </Icon>
    // </>
  );
  // const auth = useAuth();
  // const navigate = useNavigate();

  // if (auth.user === '') {
  //   return <p>You are not logged in.</p>;
  // }

  // return (
  //   <p>
  //     Hello {auth.user}!{' '}
  //     <button
  //       onClick={() => {
  //         auth.signout(() => navigate('/'));
  //       }}
  //     >
  //       Sign out
  //     </button>
  //   </p>
  // );
});
