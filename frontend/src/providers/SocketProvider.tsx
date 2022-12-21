import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { WS_BASE_URL } from 'config';
import { useSocket } from 'hooks/socket/useSocket';
import { Socket } from 'socket.io-client';

export const SocketContext = createContext<
  | {
      onlineUsers: Array<[string, boolean]>;
      socket: Socket;
      connected: boolean;
    }
  | undefined
>(undefined);

const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const socket = useSocket(WS_BASE_URL, { autoConnect: false });
  const [onlineUsers, setOnlineUsers] = useState<Array<[string, boolean]>>([]);
  const [connected, setConnected] = useState(false);
  const didLogRef = useRef(false);

  useEffect(() => {
    socket.on('connect_established', () => {
      // Strictモードによって2回発火するのを防ぐ
      // https://www.sunapro.com/react18-strict-mode/#index_id5
      if (!didLogRef.current) {
        didLogRef.current = true;
        setConnected(true);
        socket.emit('handshake', (users: Array<[string, boolean]>) => {
          setOnlineUsers(users);
        });
      }
    });

    socket.on('user_connected', (user: [string, boolean]) => {
      console.log('User connected message received');
      setOnlineUsers((prev) => [...prev, user]);
    });

    socket.on('user_disconnected', (user: [string, boolean]) => {
      console.info('User disconnected message received');
      setOnlineUsers((prev) =>
        prev.filter((onlineUserId) => onlineUserId !== user)
      );
    });

    return () => {
      socket.off('connect_established');
      socket.off('user_connected');
      socket.off('user_disconnected');
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ onlineUsers, socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
