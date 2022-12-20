import { useEffect, useState } from 'react';
import { WS_BASE_URL } from 'config';
import { useSocket } from 'hooks/socket/useSocket';
import { useNavigate } from 'react-router-dom';

export enum MatchState {
  SocketConnecting = 0,
  Matching = 1,
  MatchingCancel = 2,
  Matched = 3,
}

// ここでuseRefを使ってsocketのconnect処理ができたら理想
export const useGameMatching = (): {
  matchState: MatchState;
  setMatchState: React.Dispatch<React.SetStateAction<MatchState>>;
} => {
  const [matchState, setMatchState] = useState(MatchState.SocketConnecting);
  const socket = useSocket(`${WS_BASE_URL}/game`);
  const navigate = useNavigate();

  // socket イベント
  useEffect(() => {
    socket.on('connect_established', () => {
      console.log('[Socket Event] connect_established');
      setMatchState(MatchState.Matching);
    });

    socket.on('go_game_room', (roomId: string) => {
      console.log('[Socket Event] go_game_room');
      setMatchState(MatchState.Matched);
      navigate(`/app/games/${roomId}`);
    });

    return () => {
      if (matchState === MatchState.Matching) {
        socket.emit('matching_cancel');
      }
      socket.off('connect_established');
      socket.off('go_game_room');
    };
  }, [socket, matchState, navigate]);

  useEffect(() => {
    switch (matchState) {
      case MatchState.Matching: {
        console.log('[MatchState] Matching');
        socket.emit('random_match');
        break;
      }
      case MatchState.MatchingCancel: {
        console.log('[MatchState] MatchingCancel');
        socket.emit('matching_cancel');
        navigate('/app');
        break;
      }
    }
  }, [matchState, socket, navigate]);

  return { matchState, setMatchState };
};
