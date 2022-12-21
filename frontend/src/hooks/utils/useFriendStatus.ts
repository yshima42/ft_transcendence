import { useContext } from 'react';
import { SocketContext } from 'providers/SocketProvider';

export const useFriendStatus = (friendId: string): { isOnline: boolean } => {
  const data = useContext(SocketContext);
  if (data === undefined) {
    throw new Error('GameSocket undefined');
  }
  const { onlineUsers } = data;
  // const isOnline =
  //   onlineUsers.find((onlineUserId) => onlineUserId === friendId) !== undefined;
  const onlineUsersMap = new Map(onlineUsers);
  const isOnline = onlineUsersMap.has(friendId);

  return { isOnline };
};
