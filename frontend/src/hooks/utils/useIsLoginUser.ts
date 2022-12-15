import { useProfile } from 'hooks/api';

export const useIsLoginUser = (userId: string): { isLoginUser: boolean } => {
  const { user } = useProfile();
  const isLoginUser = userId === user.id;

  return { isLoginUser };
};
