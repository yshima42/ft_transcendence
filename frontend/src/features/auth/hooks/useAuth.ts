import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { axios } from '../../../lib/axios';

export const useAuth = (): {
  logout: () => void;
} => {
  const navigate = useNavigate();
  const to = '/';

  const logout = useCallback(() => {
    axios
      .post('http://localhost:3000/auth/logout', {
        withCredentials: true,
      })
      .then(() => navigate(to))
      .catch(() => alert('error'));
  }, [navigate]);

  return { logout };
};
