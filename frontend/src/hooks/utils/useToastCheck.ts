import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CustomToastProps, useCustomToast } from './useCustomToast';

export const useToastCheck = (): void => {
  const location = useLocation();
  const { customToast } = useCustomToast();
  const didLogRef = useRef(false);

  useEffect(() => {
    if (!didLogRef.current) {
      didLogRef.current = true;
      const state = location.state as { toastProps: CustomToastProps };
      if (state?.toastProps === undefined) {
        return;
      }
      const { title, status, description } = state.toastProps;
      customToast({ title, description, status });
    }
  }, [customToast, location.state]);
};
