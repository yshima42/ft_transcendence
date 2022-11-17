import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axios } from '../../../lib/axios';

export const useDummyAuth = (): {
  dummyLogin: (dummyId: string) => void;
  loading: boolean;
} => {
  const navigate = useNavigate();
  const to = 'app';

  const [loading, setLoading] = useState(false);

  const dummyLogin = useCallback(
    (dummyId: string) => {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('name', `${dummyId}`);
      axios
        .post('/auth/login/dummy', params)
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
