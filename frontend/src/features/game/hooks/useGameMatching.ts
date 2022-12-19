import { useEffect, useState } from 'react';
import { WS_BASE_URL } from 'config';
import { useProfile } from 'hooks/api';
import { useSocket } from 'hooks/socket/useSocket';
import { useNavigate } from 'react-router-dom';

export enum MatchState {
  Matching = 0,
  MatchingCancel = 1,
  Matched = 2,
}

// ここでuseRefを使ってsocketのconnect処理ができたら理想
export const useGameMatching = (): {
  matchState: MatchState;
  setMatchState: React.Dispatch<React.SetStateAction<MatchState>>;
} => {
  const [matchState, setMatchState] = useState(MatchState.Matching);
  const socket = useSocket(`${WS_BASE_URL}/game`);

  const { user } = useProfile();
  const navigate = useNavigate();

  // socket イベント
  useEffect(() => {
    socket.on('go_game_room', (roomId: string, isLeftSide: boolean) => {
      setMatchState(MatchState.Matched);
      navigate(`/games/${roomId}`, { state: { isLeftSide } });
    });

    return () => {
      if (matchState === MatchState.Matching) {
        socket.emit('matching_cancel');
      }
      socket.off('go_game_room');
    };
  }, [socket, matchState, navigate]);

  useEffect(() => {
    switch (matchState) {
      case MatchState.Matching: {
        socket.emit('set_user', user);
        socket.emit('random_match');
        break;
      }
      case MatchState.MatchingCancel: {
        socket.emit('matching_cancel');
        navigate('/app');
        break;
      }
    }
  }, [matchState, socket, user, navigate]);

  return { matchState, setMatchState };
};
