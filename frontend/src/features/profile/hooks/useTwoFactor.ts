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
      .post('/2fa/turn-on')
      .then(() => console.log('ok'))
      .catch(() => navigate('/', { replace: true }));
  }, []);

  const turnOff = useCallback(() => {
    axios
      .post('/2fa/turn-off')
      .then(() => console.log('ok'))
      .catch(() => navigate('/', { replace: true }));
  }, []);

  const getQrcodeUrl = useCallback(() => {
    axios
      .post<{ url: string }>('/2fa/generate')
      .then((res) => setQrcodeUrl(res.data.url))
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { turnOn, turnOff, getQrcodeUrl, qrcodeUrl };
};
