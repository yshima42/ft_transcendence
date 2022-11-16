import { useCallback } from 'react';
// import axios from 'axios';

export const useDeleteFriend = (): { deleteFriend: (id: string) => void } => {
  const deleteFriend = useCallback((id: string) => {
    alert(`${id}を削除！`);
    // ここにidを使ってフレンド削除するapiを入れる
    // axios
    //   .delete<User[]>('/users/all')
    //   .then((res) => setUsers(res.data))
    //   .catch(() => navigate('/', { replace: true }));
  }, []);

  return { deleteFriend };
};
