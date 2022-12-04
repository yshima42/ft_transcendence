import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axios } from '../../../lib/axios';

export const useTwoFactor = (): {
  turnOn: () => void;
  turnOff: () => void;
  getQrcodeUrl: () => void;
  qrcodeUrl: string;
} => {
  const [qrcodeUrl, setQrcodeUrl] = useState('');
  const navigate = useNavigate();

  const turnOn = useCallback(() => {
    axios
      .post('/users/me/profile', { isTwoFactorAuthEnabled: true })
      .then(() => console.log('ok'))
      .catch(() => navigate('/', { replace: true }));
  }, []);

  const turnOff = useCallback(() => {
    axios
      .post('/users/me/profile', { isTwoFactorAuthEnabled: false })
      .then(() => console.log('ok'))
      .catch(() => navigate('/', { replace: true }));
  }, []);

  const getQrcodeUrl = useCallback(() => {
    axios
      .post<{ url: string }>('/auth/2fa/generate')
      .then((res) => setQrcodeUrl(res.data.url))
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { turnOn, turnOff, getQrcodeUrl, qrcodeUrl };
};
