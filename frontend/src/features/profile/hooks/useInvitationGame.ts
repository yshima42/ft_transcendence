import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'providers/SocketProvider';

export enum InvitationState {
  SocketConnecting = 0,
  Inviting = 1,
  InvitingCancel = 2,
  Matched = 3,
}

export const useInvitationGame = (): {
  invitationState: InvitationState;
  setInvitationState: React.Dispatch<React.SetStateAction<InvitationState>>;
  setOpponentId: React.Dispatch<React.SetStateAction<string>>;
} => {
  const [invitationState, setInvitationState] = useState(
    InvitationState.SocketConnecting
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
      setInvitationState(InvitationState.Matched);
      navigate(`/app/games/${roomId}`);
    });

    return () => {
      if (invitationState === InvitationState.Inviting) {
        socket.emit('inviting_cancel');
      }
      socket.off('go_game_room');
    };
  }, [socket, invitationState, navigate]);

  useEffect(() => {
    switch (invitationState) {
      // case InvitationState.SocketConnecting: {
      //   if (connected) {
      //     setInvitationState(InvitationState.Inviting);
      //   }
      //   break;
      // }
      case InvitationState.Inviting: {
        console.log('[MatchState] Matching');
        socket.emit('invitation_match', { opponentId });
        break;
      }
      case InvitationState.InvitingCancel: {
        console.log('[MatchState] MatchingCancel');
        socket.emit('inviting_cancel');
        navigate('/app');
        break;
      }
    }
  }, [invitationState, socket, navigate, connected]);

  return { invitationState, setInvitationState, setOpponentId };
};
