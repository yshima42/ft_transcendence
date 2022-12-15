import { useContext } from 'react';
import { OnlineUsersContext } from 'providers/OnlineUsersProvider';

export const useFriendStatus = (friendId: string): { isOnline: boolean } => {
  const onlineUsers = useContext(OnlineUsersContext);
  const isOnline =
    onlineUsers.find((onlineUserId) => onlineUserId === friendId) !== undefined;

  return { isOnline };
};
