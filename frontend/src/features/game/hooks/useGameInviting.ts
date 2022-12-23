import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';

export enum InviteState {
  SocketConnecting = 0,
  GameSelect = 1,
  Inviting = 2,
  InvitingCancel = 3,
  Matched = 4,
}

export const useGameInvitation = (): {
  invitingState: InviteState;
  setInvitationState: React.Dispatch<React.SetStateAction<InviteState>>;
  setOpponentId: React.Dispatch<React.SetStateAction<string>>;
} => {
  const [invitationState, setInvitationState] = useState(
    InviteState.SocketConnecting
  );
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error('SocketContext undefined');
  }
  const { socket, connected } = socketContext;
  const navigate = useNavigate();
  const [opponentId, setOpponentId] = useState('');

  // socket イベント
  useEffect(() => {
    socket.on('go_game_room', (roomId: string) => {
      console.log('[Socket Event] go_game_room');
      setInvitationState(InviteState.Matched);
      navigate(`/app/games/${roomId}`);
    });

    return () => {
      if (invitationState === InviteState.Inviting) {
        socket.emit('inviting_cancel');
      }
      socket.off('go_game_room');
    };
  }, [socket, invitationState, navigate]);

  useEffect(() => {
    switch (invitationState) {
      case InviteState.SocketConnecting: {
        if (connected) {
          setInvitationState(InviteState.Inviting);
        }
        break;
      }
      case InviteState.GameSelect: {
        break;
      }
      case InviteState.Inviting: {
        console.log('[MatchState] Matching');
        socket.emit('invitation_match', { opponentId });
        break;
      }
      case InviteState.InvitingCancel: {
        console.log('[MatchState] MatchingCancel');
        navigate('/app');
        break;
      }
    }
  }, [invitationState, socket, navigate, connected]);

  return { invitingState: invitationState, setInvitationState, setOpponentId };
};
