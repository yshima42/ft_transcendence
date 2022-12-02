import { useCallback, useState } from 'react';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

export const useDummyAuth = (): {
  dummyLogin: (dummyId: string) => void;
  loading: boolean;
} => {
  const navigate = useNavigate();
  // const to = 'app';

  const [loading, setLoading] = useState(false);

  const dummyLogin = useCallback(
    (dummyId: string) => {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('name', `${dummyId}`);
      axios
        .post<{ isTwoFactorAuthenticationEnabled: boolean }>(
          '/auth/login/dummy',
          params
        )
        .then((res) => {
          const { isTwoFactorAuthenticationEnabled } = res.data;
          if (isTwoFactorAuthenticationEnabled) {
            navigate('twofactor', { replace: true });
          } else {
            navigate('app', { replace: true });
          }
          // navigate(to, { replace: true });
        })
        .catch(() => console.log('error'))
        .finally(() => setLoading(false));
    },
    [navigate]
  );

  return { dummyLogin, loading };
};
