import { useToast } from '@chakra-ui/react';

export interface CustomToastProps {
  title?: string;
  description?: string;
  status: 'info' | 'warning' | 'success' | 'error' | 'loading';
}

export const useCustomToast = (): {
  customToast: (props: CustomToastProps) => void;
} => {
  const toast = useToast();

  const customToast = (props: CustomToastProps): void => {
    const { title, description, status } = props;
    toast({
      title: title ?? status.charAt(0).toUpperCase() + status.slice(1),
      description,
      status,
      position: 'top',
      duration: 3000,
      isClosable: true,
    });
  };

  return { customToast };
};
