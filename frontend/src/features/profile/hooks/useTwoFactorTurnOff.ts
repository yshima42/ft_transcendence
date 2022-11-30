import { useCallback } from 'react';
import { axios } from '../../../lib/axios';

export const useTwoFactorTurnOff = (): {
  turnOff: () => void;
} => {
  const turnOff = useCallback(() => {
    axios
      .post('/2fa/turn-off')
      .then(() => console.log('ok'))
      .catch(() => alert('error'));
  }, []);

  return { turnOff };
};
