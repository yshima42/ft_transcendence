import { ToastId, useToast, ToastProps } from '@chakra-ui/react';

export const useCustomToast = (): {
  customToast: {
    (props: ToastProps): ToastId;
    isActive: (id: ToastId) => boolean;
    close: (id: ToastId) => void;
  };
} => {
  const toast = useToast();

  const customToast = (props: ToastProps): ToastId => {
    const {
      status = 'error',
      title = status.charAt(0).toUpperCase() + status.slice(1),
      description = '',
      position = 'top',
      duration = 3000,
      isClosable = true,
      ...toastProps
    } = props;

    return toast({
      title,
      description,
      status,
      position,
      duration,
      isClosable,
      ...toastProps,
    });
  };

  customToast.isActive = (id: ToastId): boolean => toast.isActive(id);
  customToast.close = (id: ToastId): void => toast.close(id);

  return { customToast };
};
