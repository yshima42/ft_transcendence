import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useProfile } from 'hooks/api';
import { useSocket } from 'hooks/socket/useSocket';

export const OnlineUsersContext = createContext<string[]>([]);

const OnlineUsersProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { user } = useProfile();
  // Strictモードによって2回発火するのを防ぐ
  // https://www.sunapro.com/react18-strict-mode/#index_id5
  const didLogRef = useRef(false);

  const socket = useSocket('http://localhost:3000/', {
    autoConnect: false,
  });

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const startListeners = useCallback(() => {
    socket.on('user_connected', (user: string) => {
      console.log('User connected message received');
      setOnlineUsers((prev) => [...prev, user]);
    });

    socket.on('user_disconnected', (uid: string) => {
      console.info('User disconnected message received');
      setOnlineUsers((prev) =>
        prev.filter((onlineUserId) => onlineUserId !== uid)
      );
    });
  }, [socket]);

  useEffect(() => {
    socket.connect();

    // サーバーが保持するオンラインユーザー情報を取得し、状態を更新する
    if (!didLogRef.current) {
      didLogRef.current = true;
      socket.emit('handshake', user.id, (users: string[]) => {
        setOnlineUsers(users);
      });
    }

    void startListeners();

    return () => {
      console.log('unmount');
      socket.off('user_connected');
      socket.off('user_disconnected');
      socket.disconnect();
      socket.close();
    };
  }, [startListeners, socket, user]);

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

export default OnlineUsersProvider;
