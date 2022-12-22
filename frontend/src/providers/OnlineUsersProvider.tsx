import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { WS_BASE_URL } from 'config';
import { useProfile } from 'hooks/api';
import { useSocket } from 'hooks/socket/useSocket';

export const OnlineUsersContext = createContext<string[]>([]);

const OnlineUsersProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useProfile();
  const socket = useSocket(WS_BASE_URL, { autoConnect: false });
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const didLogRef = useRef(false);

  useEffect(() => {
    socket.on('success_connect', () => {
      // Strictモードによって2回発火するのを防ぐ
      // https://www.sunapro.com/react18-strict-mode/#index_id5
      if (!didLogRef.current) {
        didLogRef.current = true;
        socket.emit('handshake', user.id, (users: string[]) => {
          setOnlineUsers(users);
        });
      }
    });

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

    return () => {
      socket.off('success_connect');
      socket.off('user_connected');
      socket.off('user_disconnected');
    };
  }, [socket, user]);

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

export default OnlineUsersProvider;