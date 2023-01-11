import { useContext, useEffect, useState } from 'react';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';

export enum MatchState {
  SocketConnecting = 0,
  Matching = 1,
  MatchingCancel = 2,
}

export const useGameMatching = (): {
  matchState: MatchState;
  setMatchState: React.Dispatch<React.SetStateAction<MatchState>>;
} => {
  const [matchState, setMatchState] = useState(MatchState.SocketConnecting);
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, isConnected } = socketContext;
  const navigate = useNavigate();
  const { customToast } = useCustomToast();

  // socket イベント
  useEffect(() => {
    socket.on('matching_room_error', (message: string) => {
      customToast({ description: message });
      navigate('/app');
    });

    socket.on('go_game_room', (roomId: string) => {
      // console.log('[Socket Event] go_game_room');
      navigate(`/app/game/rooms/${roomId}`);
    });

    return () => {
      socket.emit('leave_matching_room');
      socket.off('matching_room_error');
      socket.off('go_game_room');
    };
  }, [socket, navigate, customToast]);

  // 各state のロジック
  useEffect(() => {
    switch (matchState) {
      case MatchState.SocketConnecting: {
        if (isConnected) {
          setMatchState(MatchState.Matching);
        }
        break;
      }
      case MatchState.Matching: {
        socket.emit('join_matching_room');
        break;
      }
      case MatchState.MatchingCancel: {
        navigate('/app');
        break;
      }
    }
  }, [matchState, socket, navigate, isConnected]);

  return { matchState, setMatchState };
};
