import { useCallback } from 'react';
// import axios from 'axios';

export const useUnblockUser = (): { unblockUser: (id: string) => void } => {
  const unblockUser = useCallback((id: string) => {
    alert(`Unblock ${id}`);
    // ここにidを使ってフレンド削除するapiを入れる
    // axios
    //   .delete<User[]>('/users/all')
    //   .then((res) => setUsers(res.data))
    //   .catch(() => navigate('/', { replace: true }));
  }, []);

  return { unblockUser };
};
