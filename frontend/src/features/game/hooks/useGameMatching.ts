import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';

export enum MatchState {
  SocketConnecting = 0,
  Matching = 1,
  MatchingCancel = 2,
  Matched = 3,
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

  // socket イベント
  useEffect(() => {
    socket.on('go_game_room', (roomId: string) => {
      console.log('[Socket Event] go_game_room');
      setMatchState(MatchState.Matched);
      navigate(`/app/game/rooms/${roomId}`);
    });

    return () => {
      if (matchState === MatchState.Matching) {
        socket.emit('leave_matching_room');
      }
      socket.off('go_game_room');
    };
  }, [socket, matchState, navigate]);

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
        socket.emit('leave_matching_room');
        navigate('/app');
        break;
      }
    }
  }, [matchState, socket, navigate, isConnected]);

  return { matchState, setMatchState };
};
