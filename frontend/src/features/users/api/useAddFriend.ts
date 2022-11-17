import { useCallback } from 'react';
// import axios from 'axios';

export const useAddFriend = (): { addFriend: (id: string) => void } => {
  const addFriend = useCallback((id: string) => {
    alert(`adding ${id}`);
    // ここにidを使ってフレンド削除するapiを入れる
    // axios
    //   .delete<User[]>('/users/all')
    //   .then((res) => setUsers(res.data))
    //   .catch(() => navigate('/', { replace: true }));
  }, []);

  return { addFriend };
};
