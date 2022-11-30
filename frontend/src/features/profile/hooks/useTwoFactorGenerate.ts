import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axios } from '../../../lib/axios';

export const useTwoFactorGenerate = (): {
  getQrcode: () => void;
  url: string;
} => {
  const [url, setQrcode] = useState('');
  const navigate = useNavigate();

  const getQrcode = useCallback(() => {
    axios
      .post<{ url: string }>('/2fa/generate')
      .then((res) => setQrcode(res.data.url))
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { getQrcode, url };
};
