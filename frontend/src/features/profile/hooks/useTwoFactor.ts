import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axios } from '../../../lib/axios';

export const useTwoFactor = (): {
  turnOn: () => Promise<void>;
  turnOff: () => Promise<void>;
  getQrcodeUrl: () => Promise<void>;
  qrcodeUrl: string;
} => {
  const [qrcodeUrl, setQrcodeUrl] = useState('');
  const navigate = useNavigate();

  const turnOn = useCallback(async () => {
    await axios
      .post('/users/me/profile', { isTwoFactorAuthEnabled: true })
      .catch(() => navigate('/', { replace: true }));
    console.log('ok');
  }, []);

  const turnOff = useCallback(async () => {
    await axios
      .post('/users/me/profile', { isTwoFactorAuthEnabled: false })
      .catch(() => navigate('/', { replace: true }));
    console.log('ok');
  }, []);

  const getQrcodeUrl = useCallback(async () => {
    const res = await axios
      .get<{ url: string }>('/auth/2fa/generate')
      .catch(() => {
        navigate('/', { replace: true });
        throw new Error('');
      });
    console.log('getqucodeurl OK');
    setQrcodeUrl(res.data.url);
  }, [navigate]);

  return { turnOn, turnOff, getQrcodeUrl, qrcodeUrl };
};
