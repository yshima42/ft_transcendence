import { useCallback } from 'react';
// import axios from 'axios';

export const useBlockUser = (): { blockUser: (id: string) => void } => {
  const blockUser = useCallback((id: string) => {
    alert(`Block ${id}`);
    // ここにidを使ってフレンド削除するapiを入れる
    // axios
    //   .delete<User[]>('/users/all')
    //   .then((res) => setUsers(res.data))
    //   .catch(() => navigate('/', { replace: true }));
  }, []);

  return { blockUser };
};
