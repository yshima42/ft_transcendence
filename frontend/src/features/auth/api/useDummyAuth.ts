import { useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useDummyAuth = (): {
  dummyLogin: (dummyId: string) => void;
  loading: boolean;
} => {
  const navigate = useNavigate();
  const to = 'app/user-list';

  const [loading, setLoading] = useState(false);

  const dummyLogin = useCallback(
    (dummyId: string) => {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('name', `${dummyId}`);
      axios
        .post('http://localhost:3000/auth/login/dummy', params, {
          withCredentials: true,
        })
        .then(() => {
          navigate(to, { replace: true });
        })
        .catch(() => console.log('error'))
        .finally(() => setLoading(false));
    },
    [navigate]
  );

  return { dummyLogin, loading };
};
