import { useNavigate } from 'react-router-dom';

import { axios } from '../lib/axios';

export const useLogout = (): (() => void) => {
  const navigate = useNavigate();

  const logout = () => {
    const params = new URLSearchParams();
    axios
      .post('http://localhost:3000/auth/logout', params, {
        withCredentials: true,
      })
      .then(() => navigate('/'))
      .catch(() => alert('error'));
  };

  return logout;
};
