import { useCallback } from 'react';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';


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
