import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ToastId } from '@chakra-ui/react';
import { WS_BASE_URL } from 'config';
import { useSocket } from 'hooks/socket/useSocket';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { Socket } from 'socket.io-client';
import { InvitationAlert } from './InvitationAlert';

export enum Presence {
  OFFLINE = 0,
  ONLINE = 1,
  INGAME = 2,
}

export const SocketContext = createContext<
  | {
      userIdToPresenceMap: Map<string, Presence>;
      userIdToGameRoomIdMap: Map<string, string>;
      socket: Socket;
      isConnected: boolean;
    }
  | undefined
>(undefined);

const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const socket = useSocket(WS_BASE_URL);
  const [userIdToPresenceMap, setUserIdToPresenceMap] = useState(
    new Map<string, Presence>()
  );
  const [userIdToGameRoomIdMap, setUserIdToGameRoomIdMap] = useState(
    new Map<string, string>()
  );
  const [isConnected, setConnected] = useState(false);
  const { customToast } = useCustomToast();
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
          (message: {
            userIdToPresence: Array<[string, Presence]>;
            userIdToGameRoomId: Array<[string, string]>;
          }) => {
            setUserIdToPresenceMap(
              new Map<string, Presence>(message.userIdToPresence)
            );
            setUserIdToGameRoomIdMap(
              new Map<string, string>(message.userIdToGameRoomId)
            );
          }
        );
      }
    });

    socket.on('exception', (data: { status: string; message: string }) => {
      const { message } = data;
      const id: ToastId = 'wsException';
      if (!customToast.isActive(id)) {
        customToast({ id, description: message });
      }
    });

    socket.on('set_presence', (userIdToPresence: [string, Presence]) => {
      setUserIdToPresenceMap((userIdToPresenceMap) => {
        userIdToPresenceMap.set(...userIdToPresence);

        return new Map<string, Presence>(userIdToPresenceMap);
      });
    });

    socket.on('delete_presence', (userId: string) => {
      setUserIdToPresenceMap((userIdToPresenceMap) => {
        userIdToPresenceMap.delete(userId);

        return new Map<string, Presence>(userIdToPresenceMap);
      });
    });

    socket.on('set_game_room_id', (userIdToGameRoomId: [string, string]) => {
      setUserIdToGameRoomIdMap((userIdToGameRoomIdMap) => {
        userIdToGameRoomIdMap.set(...userIdToGameRoomId);

        return new Map<string, string>(userIdToGameRoomIdMap);
      });
    });

    socket.on('delete_game_room_id', (userId: string) => {
      setUserIdToGameRoomIdMap((userIdToGameRoomIdMap) => {
        userIdToGameRoomIdMap.delete(userId);

        return new Map<string, string>(userIdToGameRoomIdMap);
      });
    });

    return () => {
      socket.off('connect_established');
      socket.off('exception');
      socket.off('set_presence');
      socket.off('delete_presence');
      socket.off('set_game_room_id');
      socket.off('delete_game_room_id');
    };
  }, [socket, customToast]);

  return (
    <SocketContext.Provider
      value={{
        userIdToPresenceMap,
        userIdToGameRoomIdMap,
        socket,
        isConnected,
      }}
    >
      {children}
      <InvitationAlert socket={socket} isConnected={isConnected} />
    </SocketContext.Provider>
  );
};

export default SocketProvider;
