import { useCallback } from 'react';
import { axios } from '../../../lib/axios';

export const useTwoFactorTurnOn = (): {
  turnOn: () => void;
} => {
  const turnOn = useCallback(() => {
    axios
      .post('/2fa/turn-on')
      .then(() => console.log('ok'))
      .catch(() => alert('error'));
  }, []);

  return { turnOn };
};
