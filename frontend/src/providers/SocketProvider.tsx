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

export enum Presence {
  OFFLINE = 0,
  ONLINE = 1,
  INGAME = 2,
}

export const SocketContext = createContext<
  | {
      userIdToPresence: Array<[string, Presence]>;
      socket: Socket;
      connected: boolean;
    }
  | undefined
>(undefined);

const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const socket = useSocket(WS_BASE_URL, { autoConnect: false });
  const [userIdToPresence, setUserIdToPresence] = useState<
    Array<[string, Presence]>
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
          (userIdToPresence: Array<[string, Presence]>) => {
            setUserIdToPresence(userIdToPresence);
          }
        );
      }
    });

    socket.on('update_presence', (userIdToPresence: [string, Presence]) => {
      console.log('User update presence message received');
      setUserIdToPresence((prev) => [...prev, userIdToPresence]);
    });

    // TODO: ログアウト時にレンダリングがうまく行ってないので後ほど修正
    socket.on('user_disconnected', (userId: string) => {
      console.info('User disconnected message received');
      setUserIdToPresence((prev) =>
        prev.filter(
          (userIdToPresencePair) => userIdToPresencePair[0] !== userId
        )
      );
    });

    return () => {
      socket.off('connect_established');
      socket.off('update_presence');
      socket.off('user_disconnected');
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ userIdToPresence, socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
