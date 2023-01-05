import { useMemo } from 'react';
import { ToastId, useToast, ToastProps } from '@chakra-ui/react';

export const useCustomToast = (): {
  customToast: {
    (props: ToastProps): ToastId;
    isActive: (id: ToastId) => boolean;
    close: (id: ToastId) => void;
  };
} => {
  const toast = useToast();

  const customToast = useMemo(() => {
    const customToast = (props: ToastProps): ToastId => {
      const toastProps = props;

      return toast({
        title: 'Error',
        description: '',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
        ...toastProps,
      });
    };

    customToast.isActive = (id: ToastId): boolean => toast.isActive(id);
    customToast.close = (id: ToastId): void => toast.close(id);

    return customToast;
  }, [toast]);

  return { customToast };
};
