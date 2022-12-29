import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import { WS_BASE_URL } from 'config';
import { useSocket } from 'hooks/socket/useSocket';
import { useNavigate } from 'react-router-dom';
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
      connected: boolean;
    }
  | undefined
>(undefined);

const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const socket = useSocket(WS_BASE_URL, { autoConnect: false });
  const [, setUserIdToPresence] = useState<Array<[string, Presence]>>([]);
  const userIdToPresenceMap = useMemo(() => new Map<string, Presence>(), []);
  const [, setUserIdToGameRoomId] = useState<Array<[string, string]>>([]);
  const userIdToGameRoomIdMap = useMemo(() => new Map<string, string>(), []);
  const [connected, setConnected] = useState(false);
  const didLogRef = useRef(false);
  const navigate = useNavigate();
  const [invitationGameRoomId, setInvitationGameRoomId] = useState('');
  const [challengerId, setChallengerId] = useState('');

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
            setUserIdToPresence(message.userIdToPresence);
            message.userIdToPresence.forEach((eachUserIdToPresence) => {
              userIdToPresenceMap.set(...eachUserIdToPresence);
            });
            setUserIdToGameRoomId(message.userIdToGameRoomId);
            message.userIdToGameRoomId.forEach((eachUserIdToGameRoomId) => {
              userIdToGameRoomIdMap.set(...eachUserIdToGameRoomId);
            });
          }
        );
      }
    });

    // TODO: update_presenceとupdate_game_room_idをまとめるかどうか検討
    socket.on('set_presence', (userIdToPresence: [string, Presence]) => {
      console.log('User update presence message received');
      setUserIdToPresence((prev) => [...prev, userIdToPresence]);
      userIdToPresenceMap.set(...userIdToPresence);
    });

    socket.on('delete_presence', (userId: string) => {
      console.info('User delete presence message received');
      setUserIdToPresence((prev) =>
        prev.filter(
          (userIdToPresencePair) => userIdToPresencePair[0] !== userId
        )
      );
      userIdToPresenceMap.delete(userId);
    });

    socket.on('set_game_room_id', (userIdToGameRoomId: [string, string]) => {
      console.log('User update gameRoomId message received');
      setUserIdToGameRoomId((prev) => [...prev, userIdToGameRoomId]);
      userIdToGameRoomIdMap.set(...userIdToGameRoomId);
    });

    socket.on('delete_game_room_id', (userId: string) => {
      console.log('User delete gameRoomId message received');
      setUserIdToGameRoomId((prev) =>
        prev.filter(
          (userIdToGameRoomIdPair) => userIdToGameRoomIdPair[0] !== userId
        )
      );
      userIdToGameRoomIdMap.delete(userId);
    });

    socket.on(
      'receive_invitation',
      (message: { roomId: string; challengerId: string }) => {
        setChallengerId(message.challengerId);
        onOpen();
        setInvitationGameRoomId(message.roomId);
      }
    );

    return () => {
      socket.off('connect_established');
      socket.off('set_presence');
      socket.off('delete_presence');
      socket.off('set_game_room_id');
      socket.off('delete_game_room_id');
      socket.off('receive_invitation');
    };
  }, [socket]);

  // AlertDialogのleastDestructiveRefでエラーが出てたので以下を参考にエラー対応
  // (https://github.com/chakra-ui/chakra-ui/discussions/2936)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const onClickAccept = () => {
    onClose();
    socket.emit('accept_invitation', { roomId: invitationGameRoomId });
    navigate(`/app/games/${invitationGameRoomId}`);
  };

  const onClickDecline = () => {
    onClose();
    socket.emit('decline_invitation', { roomId: invitationGameRoomId });
  };

  return (
    <SocketContext.Provider
      value={{ userIdToPresenceMap, userIdToGameRoomIdMap, socket, connected }}
    >
      {children}
      <InvitationAlert
        isOpen={isOpen}
        cancelRef={cancelRef}
        onClickDecline={onClickDecline}
        onClickAccept={onClickAccept}
        challengerId={challengerId}
      />
    </SocketContext.Provider>
  );
};

export default SocketProvider;
