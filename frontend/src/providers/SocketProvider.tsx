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
      userIdToStatus: Array<[string, 'ONLINE' | 'INGAME']>;
      socket: Socket;
      connected: boolean;
    }
  | undefined
>(undefined);

const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const socket = useSocket(WS_BASE_URL, { autoConnect: false });
  const [userIdToStatus, setUserIdToStatus] = useState<
    Array<[string, 'ONLINE' | 'INGAME']>
  >([]);
  const [connected, setConnected] = useState(false);
  const didLogRef = useRef(false);

  useEffect(() => {
    socket.on('connect_established', () => {
      // Strictモードによって2回発火するのを防ぐ
      // https://www.sunapro.com/react18-strict-mode/#index_id5
      if (!didLogRef.current) {
        didLogRef.current = true;
        setConnected(true);
        socket.emit(
          'handshake',
          (userIdToStatus: Array<[string, 'ONLINE' | 'INGAME']>) => {
            setUserIdToStatus(userIdToStatus);
          }
        );
      }
    });

    socket.on(
      'user_connected',
      (userIdToStatus: [string, 'ONLINE' | 'INGAME']) => {
        console.log('User connected message received');
        setUserIdToStatus((prev) => [...prev, userIdToStatus]);
      }
    );

    // TODO: ログアウト時にレンダリングがうまく行ってないので後ほど修正
    socket.on(
      'user_disconnected',
      (userIdToStatus: [string, 'ONLINE' | 'INGAME']) => {
        console.info('User disconnected message received');
        setUserIdToStatus((prev) =>
          prev.filter((onlineUser) => onlineUser !== userIdToStatus)
        );
      }
    );

    return () => {
      socket.off('connect_established');
      socket.off('user_connected');
      socket.off('user_disconnected');
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ userIdToStatus, socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
