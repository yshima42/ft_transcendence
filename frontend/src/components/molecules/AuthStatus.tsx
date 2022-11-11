import { FC, memo, useState } from 'react';
import { Box, Icon } from '@chakra-ui/react';
import axios from 'axios';
import { GrLogout } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'types/api/user';

export const AuthStatus: FC = memo(() => {
  const [me, setMe] = useState('');
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

  axios
    .get<User>('http://localhost:3000/user/me', { withCredentials: true })
    .then((res) => {
      setMe(res.data.name);
    })
    .catch(() => navigate('/', { replace: true }));

  return (
    <>
      <Link to="profile-page">
        <Box px={4}>{me}</Box>
      </Link>
      <Icon
        as={GrLogout}
        onClick={onClickLogout}
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
      >
        logout
      </Icon>
    </>
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
